<script setup lang="ts">
import { reactive, computed } from "vue"
import LockButton from "./components/LockButton.vue"
import * as d3 from "d3-interpolate"

const min = 80 // low end of bpm range clamp
const max = 170 // high end of bpm range clamp

const state = reactive({
  bpm: 0,
  lastBpm: 0,
  tapCount: 0,
  initialTime: 0,
  showBpm: false,
  showTapPrompt: true,
  lastLocked: false,
})

function reset() {
  if (!state.lastLocked || !state.lastBpm) state.lastBpm = state.bpm
  state.bpm = 0
  state.tapCount = 0
  state.showBpm = false
  state.showTapPrompt = true
}

let timeout = setTimeout(reset, 0)

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
  const clampedBpm = Math.min(Math.max(bpm, min), max)
  return d3.interpolateCubehelixLong(
    lowColour,
    highColour,
  )((clampedBpm - min) / (max - min))
}

const backgroundColour = computed(() =>
  state.bpm ? getBPMColour(state.bpm) : "#1b1e20",
)

const lastBpmColour = computed(() =>
  state.lastBpm > 0 ? getBPMColour(state.lastBpm) : "transparent",
)

const currentBpm = computed(() => (state.showBpm ? state.bpm.toFixed(1) : ""))
</script>

<template>
  <main>
    <button @click="tap()" id="tap_button">
      <div v-show="lastBpmColour" id="last">
        <span v-show="state.lastBpm" id="last_label">
          {{ state.lastLocked ? "LOCKED" : "LAST" }}:
        </span>
        <span>{{ state.lastBpm ? state.lastBpm.toFixed(1) : "" }}</span>
        <LockButton v-model="state.lastLocked" />
      </div>
      <span v-show="state.showTapPrompt" id="tap_prompt">TAP</span>
      <span id="current_bpm">{{ currentBpm }}</span>
    </button>
  </main>
</template>

<style lang="scss">
main {
  width: 100vw;
  height: 100vh;
}

#tap_button {
  display: block;
  border: none;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  color: white;
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
  color: hsla(0, 0%, 100%, 0.5);
  z-index: 2;
  @media screen and (max-width: 380px) {
    font-size: 5rem;
  }
}

#current_bpm {
  justify-content: center;
  align-items: baseline;
  display: flex;
  margin-top: 0;
  font-size: 7rem;
  font-weight: 600;
  z-index: 2;
  @media screen and (max-width: 380px) {
    font-size: 5rem;
  }
}

#last {
  position: absolute;
  top: 0;
  justify-content: center;
  align-items: baseline;
  display: flex;
  width: 100%;
  height: 64px;
  color: #fff;
  font-weight: 600;
  font-size: 3rem;
  z-index: 2;
  background-color: v-bind(lastBpmColour);
  #last_label {
    font-size: 1.5rem;
    font-weight: 600;
    margin-right: 0.5rem;
  }
  @media screen and (max-width: 380px) {
    font-size: 2rem;
    padding: 14px 0 0 16px;
    justify-content: start;
  }
}
#last::after {
  content: "";
  position: absolute;
  top: 64px;
  left: 0;
  right: 0;
  height: 64px;
  background: linear-gradient(to bottom, v-bind(lastBpmColour), transparent);
}
</style>
