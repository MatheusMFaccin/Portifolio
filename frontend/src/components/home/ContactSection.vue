<script setup>
import { ref } from 'vue'
import { contactSection, socialLinks, footer } from '../../data/homeData.js'

const email = 'faccinmatheus@gmail.com'
const copied = ref(false)

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(email)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // fallback
    const ta = document.createElement('textarea')
    ta.value = email
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
}

// filter only GitHub and LinkedIn
const displayLinks = socialLinks.filter(
  (l) => l.label === 'GitHub' || l.label === 'LinkedIn'
)
</script>

<template>
  <footer id="contato" class="relative z-10 pt-20 pb-12 bg-[#030712] shadow-[0_-30px_60px_-15px_rgba(0,0,0,0.7)]">
    <!-- Curtain top glow -->
    <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <!-- Section Header -->
      <div class="text-center mb-14">
        <span
          class="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-3"
          :class="contactSection.badgeColor"
        >
          {{ contactSection.badge }}
        </span>
        <h2 class="text-3xl md:text-4xl font-bold text-white text-center">
          {{ contactSection.title }}
        </h2>
      </div>

      <!-- GitHub + LinkedIn -->
      <div class="flex justify-center gap-6 mb-10">
        <a
          v-for="link in displayLinks"
          :key="link.label"
          :href="link.href"
          target="_blank"
          class="w-12 h-12 rounded-xl bg-gray-800/60 border border-gray-700/40 text-gray-500 flex items-center justify-center text-xl transition-all duration-200"
          :class="[link.hoverColor, link.hoverBorder, link.hoverBg]"
          :aria-label="link.label"
        >
          <i :class="link.icon" />
        </a>
      </div>

      <!-- Email + copy button -->
      <div class="flex items-center justify-center gap-3 mb-12">
        <span class="text-gray-300 text-sm font-mono select-all">{{ email }}</span>
        <button
          @click="copyEmail"
          class="relative w-9 h-9 rounded-lg bg-gray-800/60 border border-gray-700/40 text-gray-500 flex items-center justify-center text-sm transition-all duration-200 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/10 active:scale-95 cursor-pointer"
          :aria-label="copied ? 'Copiado!' : 'Copiar email'"
          :title="copied ? 'Copiado!' : 'Copiar email'"
        >
          <!-- clipboard icon when idle, check icon when copied -->
          <i v-if="!copied" class="bi bi-clipboard" />
          <i v-else class="bi bi-check-lg text-cyan-400" />
        </button>
      </div>

      <!-- Bottom bar -->
      <div class="border-t border-gray-800/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
        <span>{{ footer.copyright }}</span>
        <span class="flex items-center gap-1.5">
          {{ footer.madeWith }}
          <i :class="`${footer.icon} ${footer.iconColor} text-[10px]`" />
          {{ footer.suffix }}
        </span>
      </div>
    </div>
  </footer>
</template>
