<script setup>
import { ref, nextTick } from 'vue'
import { projectsSection } from '../../data/homeData.js'
import { useProjectStore } from '../../stores/projectStore.js'
import ProjectGraph from '../ProjectGraph.vue'
import TechnicalSkills from './TechnicalSkills.vue'

const store = useProjectStore()

// ─── View mode toggle ─────────────────────────────────────────────────
const viewMode = ref('graph') // 'graph' | 'cards'
const graphRef = ref(null)

function setViewMode(mode) {
  viewMode.value = mode
  if (mode === 'graph') {
    nextTick(() => {
      graphRef.value?.fitGraph?.()
    })
  }
}

// ─── Resolve project logo URL (strip image:// prefix for <img>) ──────
function projectLogo(title) {
  const raw = store.PROJECTS_LOGOS[title]
  if (!raw) return ''
  return raw.replace(/^image:\/\//, '')
}
</script>

<template>
  <section id="projetos" class="relative py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <!-- Section Header (full width) -->
      <div class="text-center mx-auto max-w-3xl mb-8">
        <span
          class="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-3"
          :class="projectsSection.badgeColor"
        >
          {{ projectsSection.badge }}
        </span>
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
          {{ projectsSection.title }}
        </h2>
        <p class="text-gray-500 text-sm leading-relaxed text-center">
          {{ projectsSection.description }}
        </p>
      </div>

      <!-- Responsive grid: stack mobile, side-by-side lg+ -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Technical Skills card (4 cols on desktop, full width on mobile) -->
        <div class="w-full lg:col-span-4">
          <TechnicalSkills />
        </div>

        <!-- Content area (8 cols on desktop) -->
        <div class="relative w-full lg:col-span-8">

          <!-- ══════════════════════════════════════════════════════════
               View Mode Toggle
               ══════════════════════════════════════════════════════════ -->
          <div class="flex items-center justify-end mb-4">
            <div
              class="inline-flex items-center bg-slate-800/50 rounded-xl p-1 gap-1 border border-slate-700/30 shadow-lg"
            >
              <!-- Graph mode -->
              <button
                @click="setViewMode('graph')"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
                :class="viewMode === 'graph'
                  ? 'bg-slate-700 text-cyan-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                <span class="hidden sm:inline">Graph View</span>
              </button>

              <!-- Cards mode -->
              <button
                @click="setViewMode('cards')"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
                :class="viewMode === 'cards'
                  ? 'bg-slate-700 text-cyan-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                <span class="hidden sm:inline">Cards View</span>
              </button>
            </div>
          </div>

          <!-- ══════════════════════════════════════════════════════════
               Graph Mode
               ══════════════════════════════════════════════════════════ -->
          <div
            v-show="viewMode === 'graph'"
            class="rounded-xl overflow-hidden shadow-2xl border border-gray-700/60 bg-gray-900/60 backdrop-blur-sm h-[400px] sm:h-[500px] lg:h-[600px]"
          >
            <!-- Decorative corner brackets -->
            <div class="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-sm pointer-events-none z-10" />
            <div class="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-sm pointer-events-none z-10" />
            <div class="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-sm pointer-events-none z-10" />
            <div class="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-cyan-500/30 rounded-br-sm pointer-events-none z-10" />

            <ProjectGraph ref="graphRef" />
          </div>

          <!-- ══════════════════════════════════════════════════════════
               Cards Mode
               ══════════════════════════════════════════════════════════ -->
          <div
            v-show="viewMode === 'cards'"
            class="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div
              v-for="project in store.projects"
              :key="project.title"
              class="bg-[#0f172a] border border-slate-700/50 rounded-2xl p-6 shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <!-- Topo: Logo + Título -->
              <div class="flex items-center gap-3 mb-4">
                <div
                  v-if="projectLogo(project.title)"
                  class="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center shrink-0 overflow-hidden"
                >
                  <img
                    :src="projectLogo(project.title)"
                    :alt="project.title"
                    class="w-6 h-6 object-contain"
                    loading="lazy"
                  />
                </div>
                <h3 class="text-sm font-bold text-white leading-snug min-w-0">
                  {{ project.title }}
                </h3>
              </div>

              <!-- Meio: Descrição -->
              <p class="text-xs text-slate-400 leading-relaxed mb-5 flex-1">
                {{ project.description }}
              </p>

              <!-- Rodapé: Tecnologias -->
              <div class="flex flex-wrap gap-2 mt-auto">
                <span
                  v-for="tech in project.technologies"
                  :key="tech"
                  class="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700/40"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>
