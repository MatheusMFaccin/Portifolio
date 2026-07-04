<script setup>
import CircuitBackground from '../CircuitBackground.vue'
import { heroBadge, heroTitle, heroSubtitle, heroCta, heroResume } from '../../data/homeData.js'

const emit = defineEmits(['scroll-to'])
</script>

<template>
  <section
    id="hero"
    class="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden py-20 px-4 sm:px-6 lg:px-8"
  >
    <!-- PCB Circuit Background (Three.js / WebGL) -->
    <CircuitBackground />

    <!-- Glow orbs -->
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
    <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/8 rounded-full blur-[100px] pointer-events-none" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center justify-center text-center relative z-10">
      <div class="max-w-3xl mx-auto flex flex-col items-center justify-center text-center">
        <!-- Badge -->
        <div
          class="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs font-medium tracking-wider uppercase"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          {{ heroBadge.text }}
        </div>

        <!-- Title -->
        <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
          <span class="text-white">{{ heroTitle.prefix }}</span>
          <span
            :class="`bg-gradient-to-r ${heroTitle.gradient} bg-clip-text text-transparent`"
          >
            {{ heroTitle.highlight }}
          </span>
        </h1>

        <!-- Subtitle -->
    

        <!-- CTA -->
        <div class="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
          <button
            @click="$emit('scroll-to', heroCta.target)"
            class="group inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm tracking-wide shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer border-none"
          >
            {{ heroCta.label }}
            <i :class="`bi ${heroCta.icon} text-lg group-hover:translate-y-0.5 transition-transform`" />
          </button>

          <a
            :href="heroResume.file"
            download
            class="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm tracking-wide shadow-lg shadow-emerald-500/25 border border-emerald-400/30 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-500 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <i class="bi bi-file-earmark-pdf text-base group-hover:scale-110 transition-transform" />
            {{ heroResume.label }}
          </a>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 animate-bounce">
      <span class="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
      <i class="bi bi-chevron-down text-xs" />
    </div>
  </section>
</template>
