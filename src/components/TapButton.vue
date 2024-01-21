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
    ? getBPMColour(state.bpm)
    : state.lastBpm
      ? lastBpmColour.value
      : "#1b1e20",
)

const lastBpmColour = computed(() =>
  state.lastBpm > 0 ? getBPMColour(state.lastBpm) : "transparent",
)
</script>

<template>
  <div @click="tap()" id="tap_button">
    <div v-if="lastBpmColour" id="last">
      <span v-if="state.lastBpm" id="last_label">LAST: </span>
      {{ state.lastBpm ? state.lastBpm.toFixed(1) : "" }}
    </div>
    <span v-if="state.showTapPrompt" id="tap_prompt">TAP</span>
    <span v-else-if="state.showBpm" id="current_bpm">
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
}

#current_bpm {
  justify-content: center;
  align-items: baseline;
  display: flex;
  margin-top: 10rem;
  font-size: 7rem;
  font-weight: 600;
  z-index: 2;
}

#last {
  position: relative;
  justify-content: center;
  align-items: baseline;
  display: flex;
  width: 100%;
  height: 6rem;
  background-color: v-bind(lastBpmColour);
  color: #fff;
  font-weight: 600;
  font-size: 3rem;
  z-index: 2;
  #last_label {
    font-size: 1.5rem;
    font-weight: 600;
    margin-right: 0.5rem;
  }
}
#last::after {
  content: "";
  position: absolute;
  top: 6rem;
  left: 0;
  right: 0;
  height: 6rem;
  background: linear-gradient(to bottom, v-bind(lastBpmColour), transparent);
}
</style>
