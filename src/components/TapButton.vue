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
  lastSaved: null as number | null,
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
  console.log("tap")
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

const bpmColour = computed(() =>
  state.bpm ? getBPMColour(state.bpm, state.theme) : "white",
)

const savedBpmColour = computed(() =>
  state.lastSaved ? getBPMColour(state.lastSaved, state.theme) : null,
)

const lastBpmColour = computed(() => getBPMColour(state.lastBpm, state.theme))
</script>

<template>
  <span v-if="state.lastSaved" class="saved">
    Saved:&nbsp;
    <span class="saved-bpm">
      {{ state.lastSaved.toFixed(1) }}
    </span>
  </span>
  <span v-if="state.lastBpm !== 0" class="last">
    Last:&nbsp;
    <span class="last-bpm">
      {{ state.lastBpm.toFixed(1) }}
    </span>
  </span>
  <div @click="tap()" class="bpm-tapper">
    <span v-if="state.bpm !== 0">{{ state.bpm.toFixed(1) }}</span>
    <span v-if="state.showTapPrompt" class="tap-text">Tap</span>
  </div>
</template>

<style scoped lang="scss">
.last,
.saved {
  color: var(--bpm-last-saved-label);
  font-weight: 600;
  position: absolute;
  height: 5%;
  width: 10%;
  right: 14%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.saved {
  bottom: 37%;
  .saved-bpm {
    color: v-bind(savedBpmColour);
  }
}

.last {
  bottom: 34%;
  .last-bpm {
    color: v-bind(lastBpmColour);
  }
}

.bpm-tapper {
  width: 100%;
  height: 100%;
  cursor: pointer;
  color: v-bind(bpmColour);
  font-weight: 600;
  user-select: none;
  display: flex;
  background: var(--deck-button);
  border: 3px solid var(--deck-button-border);
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  transition:
    outline-color 450ms cubic-bezier(0.19, 1, 0.22, 1),
    outline-offset 450ms cubic-bezier(0.19, 1, 0.22, 1);
  outline: 3px dotted;
  outline-color: transparent;
  z-index: 2;
  &:active {
    outline-color: v-bind(bpmColour);
    outline-offset: 8px;
  }
}

.tap-text {
  color: var(--bpm-tap-label);
}
</style>
