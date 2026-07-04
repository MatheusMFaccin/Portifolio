<script setup>
import { navLinks } from '../../data/homeData.js'

defineProps({
  isScrolled: Boolean,
  mobileMenuOpen: Boolean,
})

const emit = defineEmits(['scroll-to', 'toggle-menu'])
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="isScrolled
      ? 'bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/60 shadow-lg shadow-black/20'
      : 'bg-transparent'"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

      <!-- Logo -->
      <button
        @click="$emit('scroll-to', 'hero')"
        class="flex items-center gap-2 group cursor-pointer bg-transparent border-none"
      >
        <span
          class="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-shadow"
        >
          MF
        </span>
        <span
          class="text-sm font-semibold tracking-wide text-gray-300 group-hover:text-white transition-colors hidden sm:inline"
        >
          Matheus Faccin
        </span>
      </button>

      <!-- Desktop Links -->
      <ul class="hidden md:flex items-center gap-1">
        <li v-for="link in navLinks" :key="link.target">
          <button
            @click="$emit('scroll-to', link.target)"
            class="px-4 py-2 text-sm font-medium text-gray-400 hover:text-cyan-400 rounded-lg hover:bg-white/5 transition-all duration-200 cursor-pointer bg-transparent border-none"
          >
            {{ link.label }}
          </button>
        </li>
      </ul>

      <!-- Mobile Hamburger -->
      <button
        @click="$emit('toggle-menu')"
        class="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer bg-transparent border-none"
        aria-label="Menu"
      >
        <i class="bi text-xl" :class="mobileMenuOpen ? 'bi-x-lg' : 'bi-list'" />
      </button>
    </div>

    <!-- Mobile Menu -->
    <Transition name="mobile-menu">
      <div
        v-if="mobileMenuOpen"
        class="md:hidden bg-gray-950/95 backdrop-blur-xl border-b border-gray-800/60 px-6 pb-4"
      >
        <button
          v-for="link in navLinks"
          :key="link.target"
          @click="$emit('scroll-to', link.target)"
          class="block w-full text-left px-4 py-3 text-sm font-medium text-gray-400 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer bg-transparent border-none"
        >
          {{ link.label }}
        </button>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
