<script setup>
import { computed, ref, shallowRef, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'
import { useProjectStore } from '../stores/projectStore.js'

// ─── Pinia Store ────────────────────────────────────────────────────────────
const store = useProjectStore()

// ─── ECharts instance & container ───────────────────────────────────────────
const chartContainer = ref(null)
const chartInstance = shallowRef(null)

// ─── Color palettes for project nodes (cyan/violet spectrum) ────────────────
const PROJECT_COLORS = ['#06b6d4', '#8b5cf6', '#3b82f6', '#ec4899']
const TECH_COLOR     = '#334155'
const TECH_BORDER    = '#475569'
const LINK_COLOR     = 'rgba(148, 163, 184, 0.45)'
const LINK_HIGHLIGHT = 'rgba(6, 182, 212, 0.95)'

// ─── Build graph data reactively from store ─────────────────────────────────
// ─── Guarda o bounding box do grafo para auto-fit da câmera ─────────────────
const graphBBox = ref({ halfW: 500, halfH: 500 })

const graphData = computed(() => {
  const nodes = []
  const links = []

  const totalProjects = store.projects.length
  const rx = 520 // Aumentado horizontalmente para espalhar melhor nas laterais do widescreen
  const ry = 250 // Aumentado verticalmente para mais espaço de respiro

  // 1) Posições dos projetos
  const projectPositions = {}
  store.projects.forEach((project, idx) => {
    const color = PROJECT_COLORS[idx % PROJECT_COLORS.length]
    const projectLogo = store.PROJECTS_LOGOS[project.title]
    // Rotacionado em 45 graus (Math.PI / 4) para posicionar os projetos nos 4 cantos e evitar acúmulo no topo/base
    const angle = Math.PI / 4 + (idx / totalProjects) * Math.PI * 2
    const px = Math.cos(angle) * rx
    const py = Math.sin(angle) * ry

    projectPositions[project.title] = { x: px, y: py, angle }

    nodes.push({
      id: `project::${project.title}`,
      name: project.title,
      category: 0,
      cursor: 'pointer',
      symbol: projectLogo ? projectLogo : 'rect',
      symbolSize: projectLogo ? 80 : 64, // Reduzido ligeiramente para dar sensação de mais espaço
      x: px,
      y: py,
      fixed: true,
      itemStyle: {
        color,
        borderColor: color,
        borderWidth: 2.5,
        shadowBlur: 22,
        shadowColor: `${color}55`,
      },
      label: {
        show: true,
        position: 'bottom',
        distance: 14,
        fontSize: 11,
        fontWeight: 600,
        color: '#e2e8f0',
        formatter: (p) => {
          const name = p.data.name
          return name.length > 22 ? name.slice(0, 20) + '…' : name
        },
      },
    })
  })

  // 2) Mapear tecnologias para os projetos que as utilizam e gerar links com cores dos projetos
  const techToProjects = {}
  store.projects.forEach((project, idx) => {
    const color = PROJECT_COLORS[idx % PROJECT_COLORS.length]
    project.technologies.forEach((tech) => {
      if (!techToProjects[tech]) {
        techToProjects[tech] = []
      }
      techToProjects[tech].push(project.title)

      links.push({
        source: `project::${project.title}`,
        target: `tech::${tech}`,
        lineStyle: {
          color: color,
          width: 2.5,
          opacity: 0.45,
        },
      })
    })
  })

  // 3) Agrupar tecnologias pelo conjunto exato de projetos conectados
  const groups = {}
  Object.keys(techToProjects).forEach((tech) => {
    const connectedProjects = techToProjects[tech].slice().sort()
    const key = connectedProjects.join('|')
    if (!groups[key]) {
      groups[key] = {
        projects: connectedProjects,
        techs: [],
      }
    }
    groups[key].techs.push(tech)
  })

  // 4) Posicionar as tecnologias sem sobreposição
  Object.keys(groups).forEach((key) => {
    const group = groups[key]
    const N = group.techs.length
    const connectedCount = group.projects.length

    if (connectedCount === 1) {
      // Exclusivas de 1 projeto -> orbitam do lado de fora em direção aos cantos da tela (leque de 150°)
      const projectTitle = group.projects[0]
      const projPos = projectPositions[projectTitle]
      
      const orbitRadius = 140 // Distância aumentada para maior separação em relação ao projeto
      const spreadAngle = Math.PI / 1.2 // Aumentado para 150 graus para espalhar bem os nós no leque
      
      group.techs.forEach((tech, i) => {
        let offset = 0
        if (N > 1) {
          const startOffset = -spreadAngle / 2
          const step = spreadAngle / (N - 1)
          offset = startOffset + i * step
        }
        const tAngle = projPos.angle + offset
        const tx = projPos.x + Math.cos(tAngle) * orbitRadius
        const ty = projPos.y + Math.sin(tAngle) * orbitRadius

        pushTechNode(tech, tx, ty)
      })
    } else if (connectedCount === totalProjects) {
      // Conectadas a todos os projetos -> espalhadas verticalmente no centro
      const R_center = 95 // Aumentado para separar mais
      group.techs.forEach((tech, i) => {
        // Começa em Math.PI / 2 (90 graus) para espalhar verticalmente
        const techAngle = Math.PI / 2 + (i / N) * Math.PI * 2
        const tx = Math.cos(techAngle) * R_center
        const ty = Math.sin(techAngle) * R_center

        pushTechNode(tech, tx, ty)
      })
    } else {
      // Compartilhadas por alguns projetos -> espalhadas ao redor do centróide
      let centroidX = 0
      let centroidY = 0
      group.projects.forEach((title) => {
        const pos = projectPositions[title]
        centroidX += pos.x
        centroidY += pos.y
      })
      centroidX /= connectedCount
      centroidY /= connectedCount

      if (Math.abs(centroidX) < 1e-5 && Math.abs(centroidY) < 1e-5) {
        centroidX = 60
        centroidY = 60
      }

      const inwardScale = 0.5
      const cx = centroidX * inwardScale
      const cy = centroidY * inwardScale

      // Espalha em círculo no grupo
      const groupRadius = 250 // Aumentado para dispersar melhor os ícones dentro do grupo
      group.techs.forEach((tech, i) => {
        const groupAngle = (i / N) * Math.PI * 2
        const tx = cx + Math.cos(groupAngle) * groupRadius
        const ty = cy + Math.sin(groupAngle) * groupRadius

        pushTechNode(tech, tx, ty)
      })
    }
  })

  function pushTechNode(tech, x, y) {
    const iconUrl = store.TECH_ICONS[tech]
    nodes.push({
      id: `tech::${tech}`,
      name: tech,
      category: 1,
      cursor: 'default',
      symbol: iconUrl ? iconUrl : 'circle',
      symbolSize: iconUrl ? 44 : 34, // Reduzido de 52/42 para 44/34 para dar sensação física de mais espaço
      x,
      y,
      fixed: true,
      itemStyle: {
        color: TECH_COLOR,
        borderColor: TECH_BORDER,
        borderWidth: 1.5,
      },
      label: {
        show: true,
        position: 'bottom',
        distance: 12,
        fontSize: 10,
        fontWeight: 500,
        color: '#cbd5e1',
      },
    })
  }

  // 5) Centraliza tudo em (0,0) e calcula o bounding box
  const nodePadding = 80 // Reduzido de 110 para 80 para permitir que fitGraph aplique maior zoom
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  nodes.forEach(n => {
    if (n.x !== undefined) {
      if (n.x - nodePadding < minX) minX = n.x - nodePadding
      if (n.x + nodePadding > maxX) maxX = n.x + nodePadding
      if (n.y - nodePadding < minY) minY = n.y - nodePadding
      if (n.y + nodePadding > maxY) maxY = n.y + nodePadding
    }
  })
  
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  nodes.forEach(n => {
    if (n.x !== undefined) {
      n.x -= cx
      n.y -= cy
    }
  })

  const halfW = (maxX - minX) / 2
  const halfH = (maxY - minY) / 2
  graphBBox.value = { halfW, halfH }

  return { nodes, links }
})

// ─── ECharts option (rebuilt when graphData changes) ────────────────────────
const chartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    show: true,
    trigger: 'item',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderColor: 'rgba(6, 182, 212, 0.3)',
    borderWidth: 1,
    padding: [8, 12],
    textStyle: { color: '#e2e8f0', fontSize: 12 },
    formatter: (params) => {
      if (!params.data) return ''
      const isProject = params.data.category === 0
      const icon = isProject ? '◆' : '◇'
      const typeLabel = isProject ? 'Projeto' : 'Tecnologia'
      return `${icon} <b>${params.data.name}</b><br/><span style="color:#64748b;font-size:11px">${typeLabel}</span>`
    },
  },
  legend: { show: false },
  animationDurationUpdate: 600,
  animationEasingUpdate: 'cubicInOut',
  series: [
    {
      type: 'graph',
      layout: 'none',                     // ← ESTÁTICO: sem simulação física
      roam: true,
      center: [0, 0],                     // Garante o alinhamento da câmera no centro (0,0)
      zoom: 0.5,                          // será sobrescrito pelo fitGraph()
      left: 'center',
      top: 'middle',
      draggable: true,
      categories: [
        { name: 'Projeto' },
        { name: 'Tecnologia' },
      ],
      data: graphData.value.nodes,
      links: graphData.value.links,
      // ── Line style ──
      lineStyle: {
        color: LINK_COLOR,
        width: 2.5,                       // Aumentado de 1.5 para maior visibilidade
        curveness: 0.15,
        opacity: 1,
      },
      // ── Emphasis ──
      emphasis: {
        focus: 'adjacency',
        lineStyle: {
          color: LINK_HIGHLIGHT,
          width: 4.0,                     // Aumentado no hover
        },
        itemStyle: {
          borderWidth: 3,
          shadowBlur: 24,
        },
      },
      blur: {
        itemStyle: {
          opacity: 0.15,
        },
        lineStyle: {
          opacity: 0.05,
        },
      },
      label: {
        position: 'bottom',
        distance: 6,
      },
      // ── Animation ──
      animation: true,
      animationDuration: 1200,
      animationEasing: 'cubicOut',
    },
  ],
}))

// ─── Initialize / Resize / Dispose ─────────────────────────────────────────
let resizeObserver = null

// ─── Auto-fit: calcula zoom para enquadrar todos os nós ──────────────────
function fitGraph() {
  if (!chartInstance.value) return
  const { halfW, halfH } = graphBBox.value
  if (!halfW || !halfH || halfW <= 0 || halfH <= 0) return
  const cw = chartInstance.value.getWidth()
  const ch = chartInstance.value.getHeight()
  if (cw === 0 || ch === 0) return
  const pad = 80 // margem nas bordas (px)
  const zoomX = (cw - pad * 2) / (halfW * 2)
  const zoomY = (ch - pad * 2) / (halfH * 2)
  const zoom = Math.min(zoomX, zoomY, 1) // não ultrapassa 1:1
  // merge default — atualiza o zoom e fixa a centralização no centro do grafo (0,0)
  chartInstance.value.setOption({ series: [{ zoom, center: [0, 0] }] })
}

onMounted(() => {
  if (!chartContainer.value) return

  chartInstance.value = echarts.init(chartContainer.value, null, { renderer: 'canvas' })
  chartInstance.value.setOption(chartOption.value)

  // Auto-fit: enquadra todos os nós
  fitGraph()

  // Click handler → only for project nodes
  chartInstance.value.on('click', (params) => {
    if (
      params.dataType === 'node' &&
      params.data &&
      params.data.category === 0
    ) {
      const title = params.data.name
      store.selectProjectByName(title)
    }
  })

  // Responsive resize + re-fit
  resizeObserver = new ResizeObserver(() => {
    chartInstance.value?.resize()
    fitGraph()
  })
  resizeObserver.observe(chartContainer.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  chartInstance.value?.dispose()
})

// Re-apply option if store.projects changes (edge case: dynamic data)
watch(chartOption, (newOpt) => {
  chartInstance.value?.setOption(newOpt, { replaceMerge: 'series' })
})

// Expose fitGraph for parent (view mode toggle)
defineExpose({ fitGraph })
</script>

<template>
  <div class="graph-wrapper relative w-full h-full overflow-hidden bg-transparent select-none">

    <!-- ══════════════════════════════════════════════════════════════════════
         ECharts Canvas
         ══════════════════════════════════════════════════════════════════════ -->
    <div
      ref="chartContainer"
      class="absolute inset-0 z-0"
    ></div>

    <!-- Subtle radial vignette over the graph -->
    <div class="absolute inset-0 pointer-events-none z-[1]"
      style="background: radial-gradient(ellipse at center, transparent 55%, rgba(3,7,18,0.6) 100%)"
    ></div>

    <!-- ══════════════════════════════════════════════════════════════════════
         Sidebar (Glassmorphism)
         Positioned absolute within the graph container, high z-index.
         Visible when store.selectedProject is truthy.
         ══════════════════════════════════════════════════════════════════════ -->
    <Transition name="sidebar">
      <div
        v-if="store.selectedProject"
        class="absolute inset-0 md:inset-y-4 md:right-4 md:left-auto md:w-96 z-30 flex flex-col overflow-hidden rounded-none md:rounded-2xl"
        style="
          background: rgba(15, 23, 42, 0.72);
          backdrop-filter: blur(24px) saturate(1.4);
          -webkit-backdrop-filter: blur(24px) saturate(1.4);
          border: none;
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.45),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        "
      >
        <!-- Glow accent on top edge -->
        <div class="h-[2px] w-full bg-gradient-to-r from-cyan-500/60 via-violet-500/40 to-transparent shrink-0"></div>

        <!-- Scrollable content area -->
        <div class="flex-1 overflow-y-auto p-6 sidebar-scroll">

          <!-- Header row -->
          <div class="flex items-start justify-between mb-5">
            <div class="flex-1 min-w-0">
              <span class="inline-block text-[10px] font-semibold tracking-[0.18em] uppercase text-cyan-400/80 mb-1.5">
                Projeto Selecionado
              </span>
              <h3 class="text-base font-bold text-white leading-snug pr-2">
                {{ store.selectedProject.title }}
              </h3>
            </div>
            <button
              @click="store.closePanel()"
              class="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-150 cursor-pointer bg-transparent border border-gray-700/40 hover:border-gray-600"
              aria-label="Fechar painel"
            >
              <i class="bi bi-x-lg text-sm"></i>
            </button>
          </div>

          <!-- Divider -->
          <div class="h-px w-full bg-gradient-to-r from-gray-700/50 via-gray-700/20 to-transparent mb-5"></div>

          <!-- Description -->
          <div class="mb-6">
            <span class="block text-[10px] font-semibold tracking-[0.15em] uppercase text-gray-500 mb-2">
              Descrição
            </span>
            <p class="text-sm leading-relaxed text-gray-300">
              {{ store.selectedProject.description }}
            </p>
          </div>

          <!-- City -->
          <div class="flex items-center gap-2 mb-6">
            <div class="w-7 h-7 rounded-lg bg-gray-800/80 border border-gray-700/40 flex items-center justify-center">
              <i class="bi bi-geo-alt text-xs text-cyan-400/70"></i>
            </div>
            <span class="text-xs font-medium text-gray-400 tracking-wide">
              {{ store.selectedProject.city }}
            </span>
          </div>

          <!-- Technologies -->
          <div class="mb-6">
            <span class="block text-[10px] font-semibold tracking-[0.15em] uppercase text-gray-500 mb-3">
              Tecnologias
            </span>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tech in store.selectedProject.technologies"
                :key="tech"
                class="inline-flex items-center px-2.5 py-1 text-[11px] font-medium tracking-wide rounded-lg border transition-colors duration-150"
                style="
                  color: #a78bfa;
                  background: rgba(139, 92, 246, 0.08);
                  border-color: rgba(139, 92, 246, 0.18);
                "
              >
                {{ tech }}
              </span>
            </div>
          </div>

          <!-- GitHub Link -->
          <div>
            <a
              v-if="store.selectedProject.github_url"
              :href="store.selectedProject.github_url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide no-underline transition-all duration-200 group"
              style="
                color: #22d3ee;
                background: rgba(6, 182, 212, 0.08);
                border: 1px solid rgba(6, 182, 212, 0.18);
              "
              @mouseenter="$event.target.style.background = 'rgba(6, 182, 212, 0.15)'; $event.target.style.borderColor = 'rgba(6, 182, 212, 0.35)'"
              @mouseleave="$event.target.style.background = 'rgba(6, 182, 212, 0.08)'; $event.target.style.borderColor = 'rgba(6, 182, 212, 0.18)'"
            >
              <i class="bi bi-github text-sm"></i>
              Ver no GitHub
              <i class="bi bi-arrow-up-right text-[10px] opacity-50 group-hover:opacity-100 transition-opacity"></i>
            </a>
            <div v-else class="flex items-center gap-2 text-xs text-gray-600 italic">
              <i class="bi bi-lock text-[10px]"></i>
              Repositório privado
            </div>
          </div>

        </div>
      </div>
    </Transition>

    <!-- ══════════════════════════════════════════════════════════════════════
         HUD corners + status label (decorative)
         ══════════════════════════════════════════════════════════════════════ -->
    <div class="absolute top-4 left-4 z-10 pointer-events-none">
      <span class="inline-flex items-center gap-1.5 text-[10px] font-medium tracking-[0.15em] uppercase text-gray-600">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500/70 animate-pulse"></span>
        Grafo Estático — Navegável
      </span>
    </div>

  </div>
</template>

<style scoped>
/* ── Sidebar slide-in transition ── */
.sidebar-enter-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.25s ease;
}
.sidebar-leave-active {
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.2s ease;
}
.sidebar-enter-from {
  transform: translateX(24px);
  opacity: 0;
}
.sidebar-leave-to {
  transform: translateX(16px);
  opacity: 0;
}

/* ── Thin scrollbar inside sidebar ── */
.sidebar-scroll::-webkit-scrollbar {
  width: 4px;
}
.sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.sidebar-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(100, 116, 139, 0.3);
  border-radius: 4px;
}
.sidebar-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(100, 116, 139, 0.5);
}
</style>
