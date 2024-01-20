<script setup lang="ts">
import { reactive, computed } from "vue"
import { getBPMColour } from "../utils/getBPMColour"

const state = reactive({
  bpm: 0,
  lastBpm: 0,
  tapCount: 0,
  initialTime: 0,
  showBpm: false,
  showTapPrompt: true,
  theme: "dark" as "dark" | "light",
})

function reset() {
  state.lastBpm = state.bpm
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

const backgroundColour = computed(() =>
  state.bpm
    ? getBPMColour(state.bpm, state.theme)
    : state.lastBpm
      ? lastBpmColour.value
      : state.theme === "dark"
        ? "#1b1e20"
        : "#f5f5f5",
)

const lastBpmColour = computed(() => getBPMColour(state.lastBpm, state.theme))
</script>

<template>
  <div @click="tap()" id="tap_button">
    <span v-if="state.lastBpm !== 0" id="last">
      <span id="last_label">LAST:</span> {{ state.lastBpm.toFixed(1) }}
    </span>
    <span id="tap_prompt" v-if="state.showTapPrompt">TAP</span>
    <span id="current_bpm" v-else-if="state.showBpm">
      {{ state.bpm.toFixed(1) }}
    </span>
  </div>
</template>

<style scoped lang="scss">
#tap_button {
  background-color: v-bind(backgroundColour);
  width: 100%;
  height: 100%;
  cursor: pointer;
  color: white;
  font-weight: 600;
  user-select: none;
  display: flex;
  justify-content: center;
  padding-top: 5%;
  transition: background-color 100ms linear;
  z-index: 2;
}

#tap_prompt {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  z-index: 2;
}

#current_bpm {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 7rem;
  font-weight: 600;
  z-index: 2;
}

#last {
  color: #fff;
  font-weight: 600;
  font-size: 3rem;
  z-index: 2;
  #last_label {
    font-size: 1.5rem;
    font-weight: 400;
    margin-right: 0.5rem;
  }
}
</style>
