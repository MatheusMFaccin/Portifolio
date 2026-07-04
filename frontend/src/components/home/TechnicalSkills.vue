<script setup>
import { ref, shallowRef, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { useProjectStore } from '../../stores/projectStore.js'

const store = useProjectStore()

// ─── Flip state ──
const flipped = ref(false)

// ─── Order das áreas (mesmo radarAxes) ──
const areaOrder = ['Frontend', 'Backend', 'Machine Learning', 'DevOps', 'Banco de Dados']

// ─── Agrupa skills por categoria ──
const groupedSkills = computed(() => {
  const groups = {}
  for (const area of areaOrder) {
    groups[area] = store.skills.filter(s => s.category === area)
  }
  return groups
})

// ─── Accordion: quais áreas estão abertas ──
const openAreas = ref(new Set())

function toggleArea(area) {
  const s = new Set(openAreas.value)
  if (s.has(area)) s.delete(area)
  else s.add(area)
  openAreas.value = s
}

// ─── Tooltip de área (hover) ──
const hoveredArea = ref(null)
const tooltipPos = ref({ x: 0, y: 0 })

const areaDescriptions = {
  'Frontend':         'Criação de interfaces visuais responsivas e interativas, com foco em experiência do usuário e componentização moderna.',
  'Backend':          'Desenvolvimento de APIs, lógica de negócio e integração de sistemas robustos, escaláveis e seguros.',
  'Machine Learning': 'Modelagem preditiva, redes neurais e análise de dados para extrair insights e automatizar decisões inteligentes.',
  'DevOps':           'Automação de infraestrutura, containerização, orquestração e deploy contínuo para ambientes reproduzíveis.',
  'Banco de Dados':   'Modelagem, otimização e gerenciamento de dados relacionais para aplicações de alto desempenho e confiabilidade.',
}

function onAreaEnter(area, event) {
  hoveredArea.value = area
  const rect = event.currentTarget.getBoundingClientRect()
  tooltipPos.value = { x: rect.left + rect.width / 2, y: rect.top - 8 }
}
function onAreaLeave() {
  hoveredArea.value = null
}

// ─── Transição accordion (handlers no script, não no template) ──
function accordionEnter(el) {
  el.style.maxHeight = el.scrollHeight + 'px'
}
function accordionAfterEnter(el) {
  el.style.maxHeight = ''
}
function accordionBeforeLeave(el) {
  el.style.maxHeight = el.scrollHeight + 'px'
  requestAnimationFrame(() => { el.style.maxHeight = '0px' })
}
function accordionAfterLeave(el) {
  el.style.maxHeight = ''
}

// ─── Skill expandida para descrição ──
const expandedSkill = ref(null)

function toggleExpand(skill) {
  expandedSkill.value = expandedSkill.value?.name === skill.name ? null : skill
}

// ─── Resolve icon URL from TECH_ICONS (strip image:// prefix for <img>) ──
function skillIcon(name) {
  const raw = store.TECH_ICONS[name]
  if (!raw) return ''
  return raw.replace(/^image:\/\//, '')
}

// ─── Cores e ícones dos headers de área ──
const areaColors = {
  'Frontend':         { bar: 'from-emerald-500 to-green-500',    accent: 'text-emerald-400', border: 'border-emerald-800/30', hoverBg: 'hover:bg-emerald-950/40',  glow: 'shadow-emerald-900/40' },
  'Backend':          { bar: 'from-blue-500 to-indigo-500',      accent: 'text-blue-400',    border: 'border-blue-800/30',    hoverBg: 'hover:bg-blue-950/40',     glow: 'shadow-blue-900/40' },
  'Machine Learning': { bar: 'from-orange-500 to-red-500',       accent: 'text-orange-400',  border: 'border-orange-800/30',  hoverBg: 'hover:bg-orange-950/40',   glow: 'shadow-orange-900/40' },
  'DevOps':           { bar: 'from-sky-400 to-cyan-500',         accent: 'text-sky-400',     border: 'border-sky-800/30',     hoverBg: 'hover:bg-sky-950/40',      glow: 'shadow-sky-900/40' },
  'Banco de Dados':   { bar: 'from-cyan-400 to-blue-500',        accent: 'text-cyan-400',    border: 'border-cyan-800/30',    hoverBg: 'hover:bg-cyan-950/40',     glow: 'shadow-cyan-900/40' },
}
const areaIcons = {
  'Frontend':         'bi-code-slash',
  'Backend':          'bi-server',
  'Machine Learning': 'bi-cpu',
  'DevOps':           'bi-hdd-rack',
  'Banco de Dados':   'bi-database',
}

// ─── Radar chart refs ──
const radarContainer = ref(null)
let radarInstance = null
let resizeObserver = null

function initRadar() {
  if (!radarContainer.value || radarInstance) return
  radarInstance = echarts.init(radarContainer.value, null, { renderer: 'canvas' })
  radarInstance.setOption({
    backgroundColor: 'transparent',
    tooltip: { show: false },
    radar: {
      indicator: store.radarAxes,
      center: ['50%', '50%'],
      radius: '68%',
      axisName: {
        color: '#94a3b8',
        fontSize: 11,
        fontWeight: 600,
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(30, 41, 59, 0.4)', 'rgba(51, 65, 85, 0.3)'],
        },
      },
      axisLine: { lineStyle: { color: 'rgba(100, 116, 139, 0.25)' } },
      splitLine: { lineStyle: { color: 'rgba(100, 116, 139, 0.15)' } },
    },
    series: [{
      type: 'radar',
      symbol: 'none',
      lineStyle: { width: 2, color: '#06b6d4' },
      areaStyle: {
        color: {
          type: 'radial',
          x: 0.5, y: 0.5, r: 0.8,
          colorStops: [
            { offset: 0, color: 'rgba(6, 182, 212, 0.35)' },
            { offset: 1, color: 'rgba(6, 182, 212, 0.05)' },
          ],
        },
      },
      data: [{ value: store.radarValues, name: 'Pegada Técnica' }],
    }],
  })
}

function destroyRadar() {
  radarInstance?.dispose()
  radarInstance = null
}

watch(flipped, (val) => {
  if (val) {
    setTimeout(() => initRadar(), 100)
  }
})

onMounted(() => {
  resizeObserver = new ResizeObserver(() => {
    radarInstance?.resize()
  })
  nextTick(() => {
    const parent = radarContainer.value?.closest('.card-wrapper')
    if (parent) resizeObserver.observe(parent)
  })
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  destroyRadar()
})
</script>

<template>
  <div class="card-container perspective-[1200px] w-full">
    <div
      class="card-wrapper relative w-full transition-transform duration-700 ease-in-out"
      :class="flipped ? '[transform:rotateY(180deg)]' : ''"
      style="transform-style: preserve-3d; min-height: 420px; max-height: 600px;"
    >
      <!-- ══════════════════════════════════════════════
           FRONT — Skills agrupadas por área (accordion)
           ══════════════════════════════════════════════ -->
      <div
        class="absolute inset-0 bg-[#0f172a] rounded-2xl border border-slate-700/50 shadow-lg shadow-black/20 p-4 sm:p-6 overflow-y-auto"
        style="backface-visibility: hidden;"
      >
        <div class="flex items-center justify-between mb-5 sm:mb-6">
          <h3 class="text-slate-200 text-sm sm:text-base font-semibold tracking-wide">
            Technical Skills
          </h3>
          <button
            @click="flipped = !flipped"
            class="text-[9px] sm:text-[10px] font-medium tracking-[0.12em] uppercase text-cyan-400 bg-cyan-950/60 hover:bg-cyan-900/50 border border-cyan-800/30 hover:border-cyan-600/50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all duration-200 cursor-pointer"
          >
            Alternar Visualização
          </button>
        </div>

        <!-- Accordion de áreas -->
        <div class="space-y-2.5 sm:space-y-3">
          <div
            v-for="area in areaOrder"
            :key="area"
            v-show="groupedSkills[area]?.length"
          >
            <!-- ═══ Header da área (clicável) ═══ -->
            <div
              class="flex items-center gap-2 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl border transition-all duration-200 select-none cursor-pointer"
              :class="[
                areaColors[area]?.border,
                areaColors[area]?.hoverBg,
                openAreas.has(area)
                  ? 'bg-slate-800/70 shadow-md ' + areaColors[area]?.glow
                  : 'bg-slate-800/30 hover:bg-slate-800/50 shadow-sm',
              ]"
              @click="toggleArea(area)"
              @mouseenter="onAreaEnter(area, $event)"
              @mouseleave="onAreaLeave"
            >
              <!-- Ícone da área -->
              <i
                class="text-sm sm:text-base"
                :class="[areaIcons[area], areaColors[area]?.accent]"
              ></i>

              <!-- Nome da área -->
              <span
                class="flex-1 text-xs sm:text-sm font-semibold tracking-wide"
                :class="openAreas.has(area) ? 'text-slate-100' : 'text-slate-400'"
              >
                {{ area }}
              </span>

              <!-- Contagem de skills -->
              <span
                class="text-[9px] sm:text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded-md"
                :class="areaColors[area]?.accent + ' bg-slate-900/60'"
              >
                {{ groupedSkills[area].length }}
              </span>

              <!-- Seta indicadora -->
              <i
                class="bi-chevron-down text-[10px] sm:text-xs text-slate-500 transition-transform duration-300"
                :class="openAreas.has(area) ? 'rotate-180 ' + areaColors[area]?.accent : ''"
              ></i>
            </div>

            <!-- ═══ Conteúdo da área (collapsible) ═══ -->
            <transition
              @enter="accordionEnter"
              @after-enter="accordionAfterEnter"
              @before-leave="accordionBeforeLeave"
              @after-leave="accordionAfterLeave"
            >
              <div v-show="openAreas.has(area)" class="overflow-hidden transition-[max-height] duration-300 ease-in-out">
                <div class="pt-2 sm:pt-2.5 space-y-1.5 sm:space-y-2">
                  <!-- Skills da área -->
                  <div
                    v-for="skill in groupedSkills[area]"
                    :key="skill.name"
                    class="flex items-center gap-2 sm:gap-3 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg cursor-pointer transition-colors duration-150"
                    :class="expandedSkill?.name === skill.name ? 'bg-slate-800/60' : 'hover:bg-slate-800/40'"
                    @click="toggleExpand(skill)"
                  >
                    <!-- Ícone -->
                    <img
                      :src="skillIcon(skill.name)"
                      :alt="skill.name"
                      class="w-4 h-4 sm:w-5 sm:h-5 shrink-0"
                      loading="lazy"
                    />

                    <!-- Label + Barra -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between mb-0.5">
                        <span class="text-[10px] sm:text-[11px] font-medium text-slate-300 truncate">
                          {{ skill.name }}
                        </span>
                        <span class="font-mono text-[9px] sm:text-[10px] text-slate-500 tabular-nums ml-2">
                          {{ skill.level }}%
                        </span>
                      </div>
                      <div class="h-1.5 sm:h-2 bg-slate-700/60 rounded-full overflow-hidden">
                        <div
                          class="h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out"
                          :class="skill.color"
                          :style="{ width: skill.level + '%' }"
                        ></div>
                      </div>
                    </div>

                    <!-- Seta descrição -->
                    <i
                      class="bi-info-circle text-[9px] sm:text-[10px] text-slate-600 transition-colors duration-150"
                      :class="expandedSkill?.name === skill.name ? areaColors[area]?.accent : ''"
                    ></i>
                  </div>

                  <!-- Descrição expandida da skill -->
                  <div
                    v-if="expandedSkill && groupedSkills[area].includes(expandedSkill)"
                    class="mx-3 sm:mx-3.5 mb-1 px-3 py-2 bg-slate-900/70 rounded-lg border border-slate-700/30 animate-fadeIn"
                  >
                    <p class="text-[10px] sm:text-xs text-slate-400 leading-relaxed">
                      {{ expandedSkill.description }}
                    </p>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════
           BACK — Radar chart
           ══════════════════════════════════════════════ -->
      <div
        class="absolute inset-0 bg-[#0f172a] rounded-2xl border border-slate-700/50 shadow-lg shadow-black/20 p-4 sm:p-6"
        style="backface-visibility: hidden; transform: rotateY(180deg);"
      >
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <h3 class="text-slate-200 text-sm sm:text-base font-semibold tracking-wide">
            Pegada Técnica
          </h3>
          <button
            @click="flipped = !flipped"
            class="text-[9px] sm:text-[10px] font-medium tracking-[0.12em] uppercase text-cyan-400 bg-cyan-950/60 hover:bg-cyan-900/50 border border-cyan-800/30 hover:border-cyan-600/50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all duration-200 cursor-pointer"
          >
            Alternar Visualização
          </button>
        </div>

        <div ref="radarContainer" class="w-full h-[260px] sm:h-[300px] lg:h-[340px]"></div>
      </div>
    </div>

    <!-- ═══ Tooltip flutuante da área (hover) ═══ -->
    <Teleport to="body">
      <div
        v-if="hoveredArea"
        class="fixed z-[9999] px-3 py-2.5 rounded-xl shadow-xl pointer-events-none border"
        :style="{
          left: tooltipPos.x + 'px',
          top: tooltipPos.y + 'px',
          transform: 'translate(-50%, -100%)',
          maxWidth: '280px',
          backgroundColor: '#0f172a',
          borderColor: 'rgba(100,116,139,0.3)',
        }"
      >
        <!-- Seta do tooltip -->
        <div
          class="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
          :style="{
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid #0f172a',
          }"
        ></div>
        <div class="flex items-center gap-1.5 mb-1">
          <i
            class="text-[10px] sm:text-[11px]"
            :class="[areaIcons[hoveredArea], areaColors[hoveredArea]?.accent]"
          ></i>
          <span
            class="text-[10px] sm:text-[11px] font-semibold"
            :class="areaColors[hoveredArea]?.accent"
          >
            {{ hoveredArea }}
          </span>
        </div>
        <p class="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed">
          {{ areaDescriptions[hoveredArea] }}
        </p>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

/* Transição suave do accordion */
.v-leave-active {
  transition: max-height 0.3s ease-in-out, opacity 0.2s ease-in-out;
}
.v-enter-active {
  transition: max-height 0.3s ease-in-out, opacity 0.2s ease-in-out;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
