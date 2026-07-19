<script setup vapor lang="ts">
import { computed } from "vue"

const locked = defineModel({ default: false, type: Boolean })
const label = computed(() =>
  locked.value ? "Unlock saved tempo" : "Lock saved tempo",
)

function toggleLock(event: MouseEvent) {
  locked.value = !locked.value

  // Pointer clicks should hand Space back to the app-wide tap shortcut.
  // Keyboard-generated clicks keep focus so the button remains operable with
  // Space and Enter as expected.
  if (event.detail > 0) {
    const button = event.currentTarget as HTMLButtonElement
    button.blur()
  }
}
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    :aria-pressed="locked"
    :title="label"
    @click.stop="toggleLock"
  >
    <!-- Lucide lock-keyhole icons; see public/licenses/Lucide-LICENSE.txt. -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="16" r="1" />
      <rect width="18" height="12" x="3" y="10" rx="2" />
      <path v-if="locked" d="M7 10V7a5 5 0 0 1 10 0v3" />
      <path v-else d="M7 10V7a5 5 0 0 1 9.33-2.5" />
    </svg>
  </button>
</template>
