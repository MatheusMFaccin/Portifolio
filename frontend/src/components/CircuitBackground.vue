<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

const canvasRef = ref(null)

// ─── Three.js core ──────────────────────────────────────────────────────────
let scene, camera, renderer, composer
let animFrameId = null

// ─── Parallax scroll ────────────────────────────────────────────────────────
let scrollY = 0
const parallaxFactor = 0.02   // 1px scroll = 0.02 world-units de camera
const initialCameraY = 0

function onScroll() {
  scrollY = window.scrollY
}

// ─── Circuit data ───────────────────────────────────────────────────────────
const flowDots = []       // { mesh, pathIdx, progress, speed }
let allPaths = []         // { segments: [{start:Vec3, end:Vec3},...], totalLength, color }
const padMeshes = []      // all pad meshes (for disposal)
const lineMeshes = []     // all line meshes

// ─── Colors ─────────────────────────────────────────────────────────────────
const CYAN    = new THREE.Color('#06b6d4')
const VIOLET  = new THREE.Color('#8b5cf6')
const SLATE   = new THREE.Color('#334155')

// ─── Circuit constants ──────────────────────────────────────────────────────
const FRUSTUM_H = 9.0               // vertical world units
let frustumW, frustumH               // computed from aspect

// ─── Trace builder helpers ──────────────────────────────────────────────────
function v(x, y) { return new THREE.Vector3(x, y, 0) }

/** Build a path with orthogonal segments (L-shape: horizontal then vertical, or vice versa) */
function orthoPath(x1, y1, x2, y2) {
  const segs = []
  // Choose direction based on which is longer
  const dx = Math.abs(x2 - x1)
  const dy = Math.abs(y2 - y1)
  if (dx > dy) {
    // Horizontal first, then vertical
    segs.push({ start: v(x1, y1), end: v(x2, y1) })
    if (dy > 0.05) segs.push({ start: v(x2, y1), end: v(x2, y2) })
  } else {
    // Vertical first, then horizontal
    segs.push({ start: v(x1, y1), end: v(x1, y2) })
    if (dx > 0.05) segs.push({ start: v(x1, y2), end: v(x2, y2) })
  }
  return segs
}

/** Create a full path object from segments */
function makePath(segments, color) {
  const totalLen = segments.reduce((sum, s) => sum + s.start.distanceTo(s.end), 0)
  return { segments, totalLength: totalLen, color }
}

/** Generate parallel bus lines (multiple traces side by side) */
function busPaths(x1, y, x2, count, spacing, color) {
  const paths = []
  const offset = -(count - 1) * spacing / 2
  for (let i = 0; i < count; i++) {
    const yi = y + offset + i * spacing
    const segs = [{ start: v(x1, yi), end: v(x2, yi) }]
    paths.push(makePath(segs, color))
  }
  return paths
}

// ─── Get position along a path at progress 0..1 ─────────────────────────────
function getPathPosition(path, progress) {
  const p = ((progress % 1) + 1) % 1
  let targetLen = p * path.totalLength
  let accumulated = 0
  for (const seg of path.segments) {
    const segLen = seg.start.distanceTo(seg.end)
    if (accumulated + segLen >= targetLen || seg === path.segments[path.segments.length - 1]) {
      const segProgress = segLen > 0.0001 ? (targetLen - accumulated) / segLen : 0
      return new THREE.Vector3().lerpVectors(seg.start, seg.end, Math.min(1, Math.max(0, segProgress)))
    }
    accumulated += segLen
  }
  return path.segments[0].start.clone()
}

// ─── Build the PCB circuit ──────────────────────────────────────────────────
function buildCircuit(w, h) {
  const paths = []
  const padPositions = new Set() // deduplicate pads at same position

  // ── Horizontal data buses (cyan, long spans) ──
  paths.push(...busPaths(-w + 0.6,  3.4, w - 0.6, 3, 0.22, CYAN))   // top bus
  paths.push(...busPaths(-w + 0.8,  1.5, w - 0.8, 2, 0.18, CYAN))   // upper-mid bus

  // ── Horizontal buses (violet) ──
  paths.push(...busPaths(-w + 0.6, -0.4, w - 0.6, 2, 0.20, VIOLET)) // mid bus
  paths.push(...busPaths(-w + 0.5, -2.0, w - 1.2, 3, 0.22, VIOLET)) // lower-mid bus

  // ── Horizontal bus (slate, background depth) ──
  paths.push(...busPaths(-w + 0.7, -3.5, w - 0.7, 2, 0.16, SLATE))  // bottom bus

  // ── Vertical branch traces connecting buses ──
  const vBranches = [
    { x: -5.5, yTop: 3.4, yBot: -3.5, color: CYAN },
    { x: -3.0, yTop: 3.4, yBot: -0.4, color: VIOLET },
    { x: -0.5, yTop: 1.5,  yBot: -2.0, color: CYAN },
    { x:  2.0, yTop: 3.4,  yBot: -3.5, color: VIOLET },
    { x:  4.5, yTop: 3.4,  yBot: -0.4, color: CYAN },
    { x:  6.0, yTop: 1.5,  yBot: -2.0, color: VIOLET },
  ]
  for (const br of vBranches) {
    const segs = [{ start: v(br.x, br.yTop), end: v(br.x, br.yBot) }]
    paths.push(makePath(segs, br.color))
  }

  // ── 45° diagonal traces (classic motherboard DDR routing) ──
  const diagonals = [
    { x1: -6.5, y1: 3.4,  x2: -5.5, y2: 1.5,  color: VIOLET },
    { x1: -4.0, y1: 1.5,  x2: -3.0, y2: -0.4, color: CYAN },
    { x1: -2.0, y1: 3.4,  x2: -0.5, y2: 1.5,  color: VIOLET },
    { x1:  1.0, y1: 1.5,  x2:  2.0, y2: -0.4, color: CYAN },
    { x1:  3.5, y1: 3.4,  x2:  4.5, y2: 1.5,  color: VIOLET },
    { x1:  5.0, y1: 1.5,  x2:  6.0, y2: -0.4, color: CYAN },
    { x1: -6.0, y1: -0.4, x2: -5.5, y2: -2.0, color: SLATE },
    { x1: -2.5, y1: -0.4, x2: -0.5, y2: -2.0, color: SLATE },
    { x1:  2.5, y1: -0.4, x2:  4.5, y2: -2.0, color: SLATE },
    { x1:  5.5, y1: -2.0, x2:  6.0, y2: -3.5, color: SLATE },
  ]
  for (const d of diagonals) {
    const segs = [{ start: v(d.x1, d.y1), end: v(d.x2, d.y2) }]
    paths.push(makePath(segs, d.color))
  }

  // ── "Component" connection traces: orthogonal paths from bus to a "pad" ──
  const componentTraces = [
    { bx: -7.0, by: 3.4, px: -7.8, py: 2.0, color: CYAN },
    { bx: -7.0, by: -2.0, px: -7.8, py: -2.8, color: VIOLET },
    { bx:  7.0, by: 3.4, px:  7.8, py: 2.2, color: CYAN },
    { bx:  7.0, by: 1.5, px:  7.8, py: 0.8, color: VIOLET },
    { bx: -5.0, by: -3.5, px: -5.8, py: -4.3, color: SLATE },
    { bx:  3.0, by: -3.5, px:  3.8, py: -4.3, color: SLATE },
  ]
  for (const ct of componentTraces) {
    paths.push(makePath(orthoPath(ct.bx, ct.by, ct.px, ct.py), ct.color))
  }

  // ── Extended lower circuit (parallax depth) ──
  // Generates rows with increasing spacing so the circuit feels infinite
  const EXT_COLORS = [CYAN, VIOLET, SLATE]
  const extRows = []
  let curY = -5.5
  for (let i = 0; i < 12; i++) {
    extRows.push({ y: curY, color: EXT_COLORS[i % 3], count: 2 + (i % 2) })
    curY = curY * 1.15 - 1.8  // spacing grows as Y goes more negative
  }

  // Horizontal buses
  for (let i = 0; i < extRows.length; i++) {
    const r = extRows[i]
    const marginOff = 0.3 + ((i * 7) % 9) * 0.1
    const left  = -w + 0.5 + marginOff
    const right =  w - 0.5 - (marginOff * 0.7)
    paths.push(...busPaths(left, r.y, right, r.count, 0.16 + (i % 3) * 0.02, r.color))
  }

  // Vertical branches connecting extended rows
  const vxTable = [-w + 2.5, -w + 5.0, -1.5, 0.5, 3.0, w - 4.0, w - 1.8]
  for (let i = 1; i < extRows.length; i++) {
    const prev = extRows[i - 1]
    const curr = extRows[i]
    if (curr.y - prev.y < -1.5) {
      const x = vxTable[i % vxTable.length]
      const segs = [{ start: v(x, prev.y), end: v(x, curr.y + 0.3) }]
      paths.push(makePath(segs, curr.color))
    }
  }

  // Diagonal traces in extended section
  for (let i = 0; i < extRows.length - 1; i += 2) {
    const prev = extRows[i]
    const next = extRows[i + 1]
    const x1 = -w + 2.0 + ((i * 3) % 8) * 1.2
    const x2 = x1 + 1.8
    const segs = [{ start: v(x1, prev.y), end: v(x2, next.y) }]
    paths.push(makePath(segs, extRows[(i + 1) % extRows.length].color))
  }

  // ── Collect all unique pad positions (endpoints of all segments) ──
  for (const path of paths) {
    for (const seg of path.segments) {
      padPositions.add(`${seg.start.x.toFixed(2)},${seg.start.y.toFixed(2)}`)
      padPositions.add(`${seg.end.x.toFixed(2)},${seg.end.y.toFixed(2)}`)
    }
  }

  // ── Also add pads at intersections of vertical branches with horizontal buses ──
  const busYLevels = [3.4, 1.5, -0.4, -2.0, -3.5]
  for (const br of vBranches) {
    for (const by of busYLevels) {
      if (by >= Math.min(br.yTop, br.yBot) && by <= Math.max(br.yTop, br.yBot)) {
        padPositions.add(`${br.x.toFixed(2)},${by.toFixed(2)}`)
      }
    }
  }

  return { paths, pads: [...padPositions].map(s => {
    const [x, y] = s.split(',').map(Number)
    return v(x, y)
  })}
}

// ─── Build scene geometry ───────────────────────────────────────────────────
function buildScene() {
  // Guard: skip if frustum dimensions are invalid (prevents NaN geometry)
  if (!frustumW || !frustumH || !isFinite(frustumW) || !isFinite(frustumH)) return

  // Clean up previous
  lineMeshes.forEach(m => { m.geometry.dispose(); m.material.dispose(); scene.remove(m) })
  padMeshes.forEach(m => { m.geometry.dispose(); m.material.dispose(); scene.remove(m) })
  flowDots.forEach(d => { d.mesh.geometry.dispose(); d.mesh.material.dispose(); scene.remove(d.mesh) })
  lineMeshes.length = 0
  padMeshes.length = 0
  flowDots.length = 0

  const { paths, pads } = buildCircuit(frustumW, frustumH)
  allPaths = paths

  // ── Create line meshes ──
  for (const path of paths) {
    // Flatten all segment endpoints into one continuous line geometry
    const vertices = []
    for (const seg of path.segments) {
      if (vertices.length === 0) {
        vertices.push(seg.start.x, seg.start.y, 0)
      }
      vertices.push(seg.end.x, seg.end.y, 0)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    const mat = new THREE.LineBasicMaterial({ color: path.color, transparent: true, opacity: 0.65 })
    const line = new THREE.Line(geo, mat)
    line.renderOrder = 0
    scene.add(line)
    lineMeshes.push(line)
  }

  // ── Create pad meshes (small glowing circles) ──
  const padGeo = new THREE.RingGeometry(0.06, 0.12, 24)
  const padMatCyan = new THREE.MeshBasicMaterial({ color: CYAN, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
  const padMatViolet = new THREE.MeshBasicMaterial({ color: VIOLET, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
  const padMatSlate = new THREE.MeshBasicMaterial({ color: SLATE, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })

  // Also create filled center dots for vias
  const viaFillGeo = new THREE.CircleGeometry(0.05, 16)
  const viaFillMat = new THREE.MeshBasicMaterial({ color: CYAN, side: THREE.DoubleSide, transparent: true, opacity: 0.5 })

  for (let i = 0; i < pads.length; i++) {
    const pad = pads[i]
    // Alternate pad colors based on position
    const distFromCenter = Math.sqrt(pad.x * pad.x + pad.y * pad.y)
    let mat = padMatSlate
    if (distFromCenter < 3) mat = padMatCyan
    else if (distFromCenter < 6) mat = padMatViolet

    const ring = new THREE.Mesh(padGeo, mat)
    ring.position.copy(pad)
    ring.renderOrder = 1
    scene.add(ring)
    padMeshes.push(ring)

    // Small filled center for certain pads (vias)
    if (i % 3 === 0) {
      const fill = new THREE.Mesh(viaFillGeo, viaFillMat)
      fill.position.copy(pad)
      fill.renderOrder = 2
      scene.add(fill)
      padMeshes.push(fill)
    }
  }

  // ── Create flow dots (bright traveling spheres) ──
  const dotGeo = new THREE.SphereGeometry(0.045, 8, 8)
  const dotMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffffff') })
  const dotMatCyan = new THREE.MeshBasicMaterial({ color: CYAN })

  const dotCount = Math.max(40, paths.length * 2)
  for (let i = 0; i < dotCount; i++) {
    const pathIdx = i % paths.length
    const mat = i % 3 === 0 ? dotMat : dotMatCyan
    const dot = new THREE.Mesh(dotGeo, mat)
    dot.renderOrder = 3
    scene.add(dot)
    flowDots.push({
      mesh: dot,
      pathIdx,
      progress: (i / dotCount) * (0.3 + Math.random() * 0.4), // stagger initial positions
      speed: 0.0005 + Math.random() * 0.0015,
    })
  }
}

// ─── Animation loop ─────────────────────────────────────────────────────────
function animate() {
  animFrameId = requestAnimationFrame(animate)

  // Parallax: camera Y acompanha o scroll diretamente (sem inércia)
  camera.position.y = initialCameraY - (scrollY * parallaxFactor)
  camera.lookAt(0, camera.position.y, 0)

  // Update flow dots
  for (const dot of flowDots) {
    dot.progress += dot.speed
    const path = allPaths[dot.pathIdx]
    if (!path) continue
    const pos = getPathPosition(path, dot.progress)
    dot.mesh.position.copy(pos)
  }

  composer.render()
}

// ─── Resize handler ──────────────────────────────────────────────────────────
function onResize() {
  const w = canvasRef.value?.clientWidth  || window.innerWidth
  const h = canvasRef.value?.clientHeight || window.innerHeight
  if (w <= 0 || h <= 0 || !isFinite(w) || !isFinite(h)) return
  const aspect = w / h

  frustumW = (FRUSTUM_H * aspect) / 2
  frustumH = FRUSTUM_H / 2

  camera.left   = -frustumW
  camera.right  =  frustumW
  camera.top    =  frustumH
  camera.bottom = -frustumH
  camera.updateProjectionMatrix()

  renderer.setSize(w, h, false)
  composer.setSize(w, h)

  // Rebuild circuit for new viewport
  buildScene()
}

// ─── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(() => {
  const canvas = canvasRef.value
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  if (w <= 0 || h <= 0 || !isFinite(w) || !isFinite(h)) return
  const aspect = w / h

  frustumW = (FRUSTUM_H * aspect) / 2
  frustumH = FRUSTUM_H / 2

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(w, h, false)
  renderer.setClearColor('#030712', 1)

  // Scene
  scene = new THREE.Scene()

  // Orthographic camera (top-down)
  camera = new THREE.OrthographicCamera(-frustumW, frustumW, frustumH, -frustumH, 0.1, 100)
  camera.position.z = 5
  camera.lookAt(0, 0, 0)

  // Post-processing
  const renderScene = new RenderPass(scene, camera)
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(w, h),
    1.25,   // strength
    0.4,    // radius
    0.2,    // threshold
  )
  composer = new EffectComposer(renderer)
  composer.addPass(renderScene)
  composer.addPass(bloomPass)

  // Build circuit
  buildScene()

  // Start
  animate()
  window.addEventListener('resize', onResize)
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('scroll', onScroll)
  if (animFrameId) cancelAnimationFrame(animFrameId)
  composer?.dispose()
  renderer?.dispose()
  lineMeshes.forEach(m => { m.geometry.dispose(); m.material.dispose() })
  padMeshes.forEach(m => { m.geometry.dispose(); m.material.dispose() })
  flowDots.forEach(d => { d.mesh.geometry.dispose(); d.mesh.material.dispose() })
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="fixed inset-0 z-0 w-full h-full"
    style="background-color: #030712;"
  />
</template>
