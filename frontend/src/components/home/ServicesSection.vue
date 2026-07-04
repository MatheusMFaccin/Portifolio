<script setup>
import { servicesSection, services } from '../../data/homeData.js'
</script>

<template>
  <section id="servicos" class="relative py-20 bg-gray-900/50">
    <!-- Subtle top border glow -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <!-- Section Header -->
      <div class="text-center mx-auto max-w-2xl mb-12">
        <span class="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-cyan-400 mb-3">
          {{ servicesSection.badge }}
        </span>
        <h2 class="text-3xl md:text-4xl font-bold text-white text-center">
          {{ servicesSection.title }}
        </h2>
      </div>

      <!-- Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center w-full">
        <div
          v-for="svc in services"
          :key="svc.title"
          class="group relative rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30"
          :class="[svc.border, 'bg-gradient-to-br', svc.gradient, 'bg-gray-900/80 backdrop-blur-sm']"
        >
          <!-- Icon -->
          <div
            class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 bg-gray-800/80 border border-gray-700/50 group-hover:scale-110 transition-transform duration-300"
            :class="svc.iconColor"
          >
            <i :class="'bi ' + svc.icon" />
          </div>

          <!-- Content -->
          <h3 class="text-lg font-semibold text-white mb-3">{{ svc.title }}</h3>
          <p class="text-sm leading-relaxed text-gray-400">{{ svc.description }}</p>

          <!-- Corner accent -->
          <div class="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div class="absolute top-4 right-4 w-2 h-2 rounded-full" :class="svc.iconColor.replace('text-', 'bg-')" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
