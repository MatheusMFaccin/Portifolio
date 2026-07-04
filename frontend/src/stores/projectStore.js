import { defineStore } from 'pinia'
import { ref } from 'vue'

// ─── Dados estáticos do portfólio ───
const projects = [
  {
    title: 'Categoriza Brasil',
    description: 'Um sistema onde a vigilancia pode avaliar os estabelecimentos que comercializam alimentos e emitir um selo de classificação',
    technologies: ['Django', 'Bootstrap5', 'PostgreSQL', 'Docker','Python'],
    github_url: 'https://github.com/labedufn/categoriza-categorizabrasil-sistema/tree/main',
  },
  {
    title: 'Sistema de Analise Preditiva de Homicidios',
    description: 'Um sistema que faz a predição da taxa de tentativa de homicidios no ano para cada cidade do RS e emite alertas.',
    technologies: ['Django', 'CesiumJS', 'FastAPI', 'Docker','Python','Bootstrap5','PostgreSQL'],
    github_url: 'https://github.com/MatheusMFaccin/Sistema-de-Analise-Preditiva-de-Homicidios-com-Geoprocessamento-3D-e-Alertas-Inteligentes',
  },
  {
    title: 'MoE Gating Network — USD/JPY Morphological Forecaster',
    description: 'Sistema quantitativo que utiliza Mixture of Experts (MoE) e Deep Learning para prever a morfologia de preços (OHLC) do par USD/JPY, com pipeline de denoising e validação Walk-Forward.',
    technologies: ['Python', 'TensorFlow', 'Keras', 'MetaTrader5', 'Plotly', 'Scikit-Learn','Docker'],
    github_url: 'https://github.com/MatheusMFaccin/IA_TRADING',
  },
  {
    title: 'Sistema de Avaliação Online de Artigos',
    description: 'Um sistema onde organizadores de eventos podem criar chamadas de trabalhos e pesquisadores enviam artigos para avaliação.',
    technologies: ['Django', 'Python', 'Bootstrap5', 'PostgreSQL', 'Docker'],
    github_url: null,
  },
]


const services = [
  { title: 'Desenvolvimento de Sistemas Web', description: 'Criação de plataformas completas, desde o banco de dados até a interface do usuário, focadas em resolver problemas de negócio complexos.', icon: 'bi-laptop' },
  { title: 'APIs RESTful de Alta Performance', description: 'Desenvolvimento de APIs rápidas e escaláveis utilizando FastAPI, ideais para integrar com aplicativos móveis e front-ends modernos.', icon: 'bi-lightning-charge' },
  { title: 'Ciência de Dados e Machine Learning', description: 'Transformação de dados brutos em insights valiosos. Criação de modelos preditivos e automação de processamento de dados.', icon: 'bi-graph-up-arrow' },
  { title: 'DevOps e Infraestrutura', description: 'Configuração de ambientes de produção seguros e eficientes utilizando Docker e Nginx, garantindo que sua aplicação não saia do ar.', icon: 'bi-hdd-rack' },
]

const contact = {
  email: 'faccinmatheus@gmail.com',
  linkedin_url: 'https://www.linkedin.com/in/matheus-faccin-407ba0219/',
  instagram_url: 'https://www.instagram.com/matheusmfaccin/',
  github_url: 'https://github.com/MatheusMFaccin',
}

const PROJECTS_LOGOS ={
  'Sistema de Analise Preditiva de Homicidios': 'image:///predicao_homicidios_logo.png',
  'MoE Gating Network — USD/JPY Morphological Forecaster': 'image:///moe_predicao.png',
  'Sistema de Avaliação Online de Artigos': 'image:///saoa_logo.png',
  'Categoriza Brasil': 'image:///categoriza_logo.png',
}
const TECH_ICONS = {
  'Docker': 'image://https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
  'Python': 'image://https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
  'Django': 'image://https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg',
  'PostgreSQL': 'image://https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
  'FastAPI': 'image://https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg',
  'TensorFlow': 'image://https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg',
  'Scikit-Learn': 'image://https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg',
  'Bootstrap': 'image://https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg',
  'Keras': 'image://https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/keras/keras-original.svg',
  'Vue.js': 'image://https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg',
  'Plotly': 'image://https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/plotly/plotly-original.svg',
  'CesiumJS': 'image://public/celsiumjs.png',
  'MetaTrader5': 'image://public/Metatrader_5.png',
  'HTML': 'image://https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
  'CSS': 'image://https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg',
  'JavaScript': 'image://https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
  'TypeScript': 'image://https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
  'React': 'image://https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
  'Tailwind CSS': 'image://https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
}

const skills = [
  { name: 'Python',            level: 95, color: 'from-blue-400 to-blue-600',      description: 'Linguagem principal para automação, análise de dados, backend e machine learning.',  category: 'Backend'          },
  { name: 'HTML',              level: 90, color: 'from-orange-500 to-red-500',     description: 'Linguagem de marcação para estruturação semântica de páginas web e acessibilidade.', category: 'Frontend'         },
  { name: 'CSS',               level: 85, color: 'from-blue-400 to-indigo-500',    description: 'Estilização de interfaces com layouts modernos, animações, responsividade e design system.', category: 'Frontend'      },
  { name: 'JavaScript',        level: 88, color: 'from-yellow-400 to-amber-600',   description: 'Linguagem dinâmica para interatividade, manipulação do DOM e lógica de aplicações web.', category: 'Frontend'        },
  { name: 'Scikit-Learn',      level: 85, color: 'from-orange-400 to-red-500',     description: 'Implementação de modelos clássicos de ML: regressão, classificação e clustering.',   category: 'Machine Learning' },
  { name: 'PostgreSQL',        level: 85, color: 'from-cyan-400 to-blue-500',      description: 'Banco relacional robusto para aplicações web, analytics e dados geoespaciais.',     category: 'Banco de Dados'   },
  { name: 'TensorFlow',        level: 82, color: 'from-orange-500 to-amber-600',   description: 'Criação e treinamento de modelos de deep learning para visão computacional e NLP.', category: 'Machine Learning' },
  { name: 'Docker',            level: 82, color: 'from-sky-400 to-cyan-500',       description: 'Containerização e orquestração de ambientes reproduzíveis de desenvolvimento e produção.', category: 'DevOps'       },
  { name: 'Tailwind CSS',      level: 80, color: 'from-teal-400 to-cyan-500',      description: 'Framework CSS utility-first para construção rápida de interfaces consistentes e responsivas.', category: 'Frontend'    },
  { name: 'FastAPI',           level: 78, color: 'from-teal-400 to-emerald-500',   description: 'Framework moderno para APIs REST assíncronas com validação automática e OpenAPI.',    category: 'Backend'          },
  { name: 'Django',            level: 75, color: 'from-green-700 to-green-900',     description: 'Framework web completo com ORM, admin nativo e escalabilidade para aplicações robustas.', category: 'Backend'       },
  { name: 'Keras',             level: 75, color: 'from-red-400 to-rose-600',       description: 'API de alto nível para prototipagem rápida e experimentação com redes neurais.',     category: 'Machine Learning' },
  { name: 'Vue.js',            level: 72, color: 'from-emerald-400 to-green-600',  description: 'Framework progressivo para interfaces web reativas com componentização reativa.',   category: 'Frontend'         },
  { name: 'TypeScript',        level: 70, color: 'from-blue-500 to-indigo-600',    description: 'Superset tipado do JavaScript para código mais seguro, escalável e de fácil manutenção.', category: 'Frontend'      },
  { name: 'Bootstrap',         level: 65, color: 'from-purple-500 to-violet-600',  description: 'Framework CSS para interfaces responsivas, componentizadas e prontas para produção.', category: 'Frontend'        },
  { name: 'React',             level: 65, color: 'from-cyan-400 to-sky-500',        description: 'Biblioteca declarativa para construção de interfaces SPA com componentes reutilizáveis e estado reativo.', category: 'Frontend' },
]

const radarAxes = [
  { name: 'Frontend',        max: 100 },
  { name: 'Backend',         max: 100 },
  { name: 'Machine Learning', max: 100 },
  { name: 'DevOps',          max: 100 },
  { name: 'Banco de Dados',  max: 100 },
]

const radarValues = [78, 90, 85, 80, 80]

export const useProjectStore = defineStore('projects', () => {
  // ── Reactive state ──
  const selectedProject = ref(null)
  const isRotating = ref(true)

  // ── Getters: hub and non-hub city projects ──
  const hubProject = () => projects.find((p) => p.city === 'São Paulo')
  const otherProjects = () => projects.filter((p) => p.city !== 'São Paulo')

  // ── Actions ──
  function selectProjectByName(name) {
    const project = projects.find((p) => p.title === name)
    if (project) {
      selectedProject.value = project
      isRotating.value = false
    }
  }

  function closePanel() {
    selectedProject.value = null
    isRotating.value = true
  }

  return {
    // Static data
    projects,
    services,
    contact,
    PROJECTS_LOGOS,
    TECH_ICONS,
    skills,
    radarAxes,
    radarValues,
    // Reactive state
    selectedProject,
    isRotating,
    // Actions
    selectProjectByName,
    closePanel,
    hubProject,
    otherProjects,
  }
})
