<script setup vapor lang="ts">
import { computed, onMounted, onUnmounted, reactive } from "vue"
import LockButton from "./components/LockButton.vue"

const MIN_COLOUR_BPM = 80
const MAX_COLOUR_BPM = 170
const MAX_INTERVALS = 8
const RESET_DELAY_MS = 2000

const state = reactive({
  bpm: 0,
  lastBpm: 0,
  tapCount: 0,
  lastLocked: false,
})

const tapTimes: number[] = []
let resetTimeout: ReturnType<typeof setTimeout> | undefined

function calculateBpm() {
  const intervals = tapTimes
    .slice(1)
    .map((time, index) => time - tapTimes[index]!)

  // Once enough samples exist, ignore the fastest and slowest taps. This keeps
  // one early miss from skewing the reading while retaining a responsive window.
  const samples =
    intervals.length >= 5
      ? [...intervals].sort((a, b) => a - b).slice(1, -1)
      : intervals
  const averageInterval =
    samples.reduce((total, interval) => total + interval, 0) / samples.length

  return 60000 / averageInterval
}

function resetSession() {
  if (!state.lastLocked && state.bpm) state.lastBpm = state.bpm

  state.bpm = 0
  state.tapCount = 0
  tapTimes.length = 0
  resetTimeout = undefined
}

function tap() {
  const now = performance.now()
  const lastTap = tapTimes[tapTimes.length - 1]

  // Timers can be throttled in background tabs, so also enforce the reset when
  // the next tap arrives.
  if (lastTap && now - lastTap >= RESET_DELAY_MS) resetSession()

  tapTimes.push(now)
  if (tapTimes.length > MAX_INTERVALS + 1) tapTimes.shift()

  state.tapCount++
  if (tapTimes.length > 1) state.bpm = calculateBpm()

  clearTimeout(resetTimeout)
  resetTimeout = setTimeout(resetSession, RESET_DELAY_MS)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.code !== "Space" || event.repeat) return

  // Let focused buttons handle Space natively so a keyboard tap is never
  // counted twice and the lock control remains independently operable.
  if (event.target instanceof HTMLButtonElement) return

  event.preventDefault()
  tap()
}

onMounted(() => window.addEventListener("keydown", handleKeydown))
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown)
  clearTimeout(resetTimeout)
})

function getBpmColour(bpm: number) {
  const clampedBpm = Math.min(Math.max(bpm, MIN_COLOUR_BPM), MAX_COLOUR_BPM)
  const progress =
    (clampedBpm - MIN_COLOUR_BPM) / (MAX_COLOUR_BPM - MIN_COLOUR_BPM)
  const hue = 155 + progress * 187
  const lightness = 35 + progress * 5

  return `hsl(${hue.toFixed(1)} 62% ${lightness.toFixed(1)}%)`
}

const backgroundColour = computed(() =>
  state.bpm ? getBpmColour(state.bpm) : "#292f38",
)
const lastBpmColour = computed(() => getBpmColour(state.lastBpm))
const currentBpm = computed(() => (state.bpm ? state.bpm.toFixed(1) : ""))
const prompt = computed(() => (state.tapCount ? "AGAIN" : "TAP"))
const promptDetail = computed(() =>
  state.tapCount ? "KEEP TAPPING" : "ANYWHERE",
)
const surfaceLabel = computed(() => {
  if (currentBpm.value) {
    return `Tap tempo. Current tempo ${currentBpm.value} beats per minute.`
  }

  return state.tapCount
    ? "Tap again to calculate the tempo."
    : "Tap to start measuring the tempo."
})
</script>

<template>
  <main>
    <button
      id="tap_button"
      type="button"
      :aria-label="surfaceLabel"
      aria-describedby="tap_hint"
      @click="tap"
    >
      <span
        v-if="state.tapCount"
        :key="state.tapCount"
        class="tap-pulse"
        aria-hidden="true"
      />

      <span class="tempo-display" aria-live="polite" aria-atomic="true">
        <span v-if="currentBpm" id="current_bpm">{{ currentBpm }}</span>
        <span v-else id="tap_prompt">{{ prompt }}</span>
        <span class="tempo-detail">
          {{ currentBpm ? "BPM" : promptDetail }}
        </span>
      </span>

      <span id="tap_hint" class="tap-hint tap-hint--keyboard">
        <kbd>SPACE</kbd> TO TAP · PAUSE TO SAVE
      </span>
      <span class="tap-hint tap-hint--touch">PAUSE TO SAVE</span>
    </button>

    <section v-if="state.lastBpm" id="last" aria-label="Saved tempo">
      <span id="last_label">{{ state.lastLocked ? "LOCKED" : "LAST" }}</span>
      <output>{{ state.lastBpm.toFixed(1) }}</output>
      <span class="last-unit">BPM</span>
      <LockButton id="lock_button" v-model="state.lastLocked" />
    </section>
  </main>
</template>

<style lang="scss">
main {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100svh;
  overflow: hidden;
  background: #292f38;
}

#tap_button {
  position: relative;
  display: grid;
  width: 100%;
  height: 100%;
  min-height: 100svh;
  place-items: center;
  overflow: hidden;
  border: 0;
  padding: 0;
  color: rgb(255 255 255 / 92%);
  background-color: v-bind(backgroundColour);
  background-image: radial-gradient(
    circle at 50% 45%,
    rgb(255 255 255 / 5%),
    transparent 46%
  );
  transition: background-color 120ms linear;
  touch-action: manipulation;

  &::after {
    position: absolute;
    inset: 0;
    background: rgb(255 255 255 / 12%);
    content: "";
    opacity: 0;
    pointer-events: none;
    transition: opacity 80ms linear;
  }

  &:active::after {
    opacity: 1;
  }

  &:focus-visible {
    outline: 3px solid rgb(255 255 255 / 88%);
    outline-offset: -7px;
  }
}

.tempo-display {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;
  pointer-events: none;
}

#tap_prompt,
#current_bpm {
  color: #fff;
  font-weight: 650;
  text-shadow: 0 2px 24px rgb(0 0 0 / 12%);
}

#tap_prompt {
  font-size: clamp(5rem, 21vmin, 11rem);
  letter-spacing: -0.05em;
}

#current_bpm {
  font-size: clamp(4rem, 18vmin, 10rem);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.075em;
}

.tempo-detail {
  margin-top: clamp(0.75rem, 2.5vmin, 1.25rem);
  padding-left: 0.28em;
  color: rgb(255 255 255 / 72%);
  font-size: clamp(0.75rem, 2.2vmin, 1rem);
  font-weight: 600;
  letter-spacing: 0.28em;
}

.tap-pulse {
  position: absolute;
  z-index: 1;
  width: clamp(12rem, 42vmin, 28rem);
  aspect-ratio: 1;
  border: 2px solid rgb(255 255 255 / 46%);
  border-radius: 50%;
  pointer-events: none;
  animation: tap-pulse 480ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes tap-pulse {
  from {
    opacity: 0.85;
    transform: scale(0.55);
  }

  to {
    opacity: 0;
    transform: scale(1.2);
  }
}

.tap-hint {
  position: absolute;
  z-index: 2;
  bottom: max(1.5rem, calc(env(safe-area-inset-bottom) + 0.75rem));
  color: rgb(255 255 255 / 48%);
  font-size: 0.7rem;
  font-weight: 550;
  letter-spacing: 0.12em;
  pointer-events: none;
}

.tap-hint kbd {
  border: 1px solid rgb(255 255 255 / 24%);
  border-radius: 0.3rem;
  padding: 0.18rem 0.38rem;
  font: inherit;
}

.tap-hint--touch {
  display: none;
}

#last {
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: calc(8rem + env(safe-area-inset-top));
  align-items: flex-start;
  justify-content: center;
  padding-top: calc(0.85rem + env(safe-area-inset-top));
  color: rgb(255 255 255 / 92%);
  background: linear-gradient(
    to bottom,
    v-bind(lastBpmColour) 52%,
    transparent
  );
  pointer-events: none;
  animation: reveal-last 180ms ease-out;
}

@keyframes reveal-last {
  from {
    opacity: 0;
    transform: translateY(-0.5rem);
  }
}

#last_label {
  margin-top: 0.76rem;
  margin-right: 0.55rem;
  color: rgb(255 255 255 / 68%);
  font-size: 0.72rem;
  font-weight: 650;
  letter-spacing: 0.14em;
}

#last output {
  font-size: clamp(2rem, 7vmin, 3rem);
  font-weight: 650;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.055em;
  line-height: 1.05;
}

.last-unit {
  align-self: flex-start;
  margin-top: 1.05rem;
  margin-left: 0.35rem;
  color: rgb(255 255 255 / 68%);
  font-size: 0.64rem;
  font-weight: 650;
  letter-spacing: 0.12em;
}

#lock_button {
  position: absolute;
  top: calc(0.55rem + env(safe-area-inset-top));
  right: max(0.55rem, env(safe-area-inset-right));
  display: grid;
  width: 3rem;
  height: 3rem;
  place-items: center;
  border: 0;
  border-radius: 50%;
  color: rgb(255 255 255 / 86%);
  background: rgb(255 255 255 / 8%);
  pointer-events: auto;
  transition:
    background-color 120ms ease,
    transform 120ms ease;

  svg {
    width: 1.35rem;
    height: 1.35rem;
  }

  &:focus-visible {
    outline: 2px solid rgb(255 255 255 / 88%);
    outline-offset: 2px;
  }
}

@media (hover: hover) {
  #lock_button:hover {
    background: rgb(255 255 255 / 14%);
    transform: scale(1.05);
  }
}

@media (pointer: coarse) {
  .tap-hint--keyboard {
    display: none;
  }

  .tap-hint--touch {
    display: block;
  }
}

@media (max-height: 500px) {
  #tap_prompt {
    font-size: clamp(4rem, 28vmin, 7rem);
  }

  #current_bpm {
    font-size: clamp(3.5rem, 24vmin, 6.5rem);
  }

  #last {
    height: calc(6rem + env(safe-area-inset-top));
  }
}

@media (prefers-reduced-motion: reduce) {
  #tap_button,
  #tap_button::after,
  #lock_button {
    transition: none;
  }

  .tap-pulse,
  #last {
    animation: none;
  }
}
</style>
