<script setup lang="ts">
const locked = defineModel({ default: false, type: Boolean })
</script>

<template>
  <button @click.stop="locked = !locked" id="lock_button">
    <!-- svg from https://lucide.dev/icons/lock-keyhole + /lock-keyhole-open -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="16" r="1" />
      <rect width="18" height="12" x="3" y="10" rx="2" />
      <path v-if="locked" d="M7 10V7a5 5 0 0 1 10 0v3" />
      <path v-else d="M7 10V7a5 5 0 0 1 9.33-2.5" />
    </svg>
  </button>
</template>

<style lang="scss">
#lock_button {
  color: #fff;
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  height: 64px;
  width: 64px;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  svg {
    transition: transform 100ms;
  }
  &:hover {
    svg {
      transform: scale(1.1);
    }
  }
}
</style>
