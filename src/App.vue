<script setup lang="ts">
import { reactive, computed } from "vue"
import LockButton from "./components/LockButton.vue"
import * as d3 from "d3-interpolate"

const MIN = 80 // low end of bpm range clamp
const MAX = 170 // high end of bpm range clamp

const state = reactive({
  bpm: 148.7,
  lastBpm: 118.2,
  tapCount: 0,
  initialTime: 0,
  showBpm: true,
  showTapPrompt: false,
  lastLocked: false,
})

function reset() {
  if (!state.lastLocked || !state.lastBpm) state.lastBpm = state.bpm
  state.bpm = 0
  state.tapCount = 0
  state.showBpm = false
  state.showTapPrompt = true
}

let timeout = 0

function tap() {
  if (state.tapCount === 0) {
    state.initialTime = Date.now()
    state.showTapPrompt = false
  } else {
    state.bpm = 60000 / ((Date.now() - state.initialTime) / state.tapCount)
    state.showBpm = true
  }
  state.tapCount++
  clearTimeout(timeout)
  timeout = setTimeout(reset, 2000)
}

function getBPMColour(bpm: number): string {
  const lowColour = "hsl(155, 60%, 50%)"
  const highColour = "hsl(342, 70%, 62%)"
  const clampedBpm = Math.min(Math.max(bpm, MIN), MAX)
  return d3.interpolateCubehelixLong(
    lowColour,
    highColour,
  )((clampedBpm - MIN) / (MAX - MIN))
}

const backgroundColour = computed(() =>
  state.bpm ? getBPMColour(state.bpm) : "#292f38",
)

const lastBpmColour = computed(() =>
  state.lastBpm > 0 ? getBPMColour(state.lastBpm) : "transparent",
)

const currentBpm = computed(() => (state.showBpm ? state.bpm.toFixed(1) : ""))
</script>

<template>
  <main>
    <button @click="tap()" id="tap_button" aria-label="tap">
      <div v-show="lastBpmColour" id="last">
        <span v-show="state.lastBpm" id="last_label">
          {{ state.lastLocked ? "LOCK" : "LAST" }}:
        </span>
        <span>{{ state.lastBpm ? state.lastBpm.toFixed(1) : "" }}</span>
        <LockButton v-model="state.lastLocked" id="lock_button" />
      </div>
      <span v-show="state.showTapPrompt" id="tap_prompt">TAP</span>
      <span id="current_bpm">{{ currentBpm }}</span>
    </button>
  </main>
</template>

<style lang="scss">
#tap_button {
  color: hsla(0, 0%, 100%, 0.86);
  border: none;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  font-weight: 600;
  user-select: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: v-bind(backgroundColour);
  transition: background-color 100ms linear;
}

#tap_prompt {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 9rem;
  font-weight: 600;
  color: hsla(0, 0%, 100%, 0.86);
  z-index: 2;
}

#current_bpm {
  justify-content: center;
  align-items: baseline;
  display: flex;
  margin-top: 0;
  font-size: 7rem;
  font-weight: 600;
  z-index: 2;
}

#last {
  position: absolute;
  top: 0;
  justify-content: center;
  align-items: baseline;
  display: flex;
  width: 100%;
  height: 80px;
  font-weight: 600;
  font-size: 3rem;
  z-index: 2;
  padding: 8px 0 0;
  background-color: v-bind(lastBpmColour);
  #last_label {
    font-size: 1.5rem;
    font-weight: 600;
    margin-right: 0.5rem;
  }
}

#last::after {
  content: "";
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to bottom, v-bind(lastBpmColour), transparent);
}

#lock_button {
  position: absolute;
  right: 0;
  top: 0;
  padding: 29px 16px 16px;
  background: none;
  border: none;
  svg {
    color: #fff;
    opacity: 0.86;
    height: 24px;
    width: 24px;
    transition: transform 100ms;
  }
  &:hover {
    svg {
      transform: scale(1.1);
    }
  }
}

@media screen and (max-width: 400px) {
  #tap_prompt,
  #current_bpm {
    font-size: 5rem;
  }

  #last {
    font-size: 2rem;
    padding: 24px 0 0 16px;
    justify-content: start;
  }

  #last_label {
    font-size: 1.3rem;
    margin-right: 0.3rem;
  }

  #lock_button {
    padding-top: 30px;
  }
}
</style>
