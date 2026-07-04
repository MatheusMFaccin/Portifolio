/**
 * Centralized text and data for the HomeView.
 * All labels, titles, descriptions, links, and static content
 * used by home sections live here — edit in one place, reflect everywhere.
 */

export const navLinks = [
  { label: 'Início', target: 'hero' },
  { label: 'Serviços', target: 'servicos' },
  { label: 'Projetos', target: 'projetos' },
  { label: 'Contato', target: 'contato' },
]

export const heroBadge = {
  text: 'Ciência de Dados · Inteligência Artificial',
  color: 'text-cyan-400',
}

export const heroTitle = {
  prefix: 'Matheus',
  highlight: 'Faccin',
  gradient: 'from-cyan-400 via-blue-500 to-violet-500',
}

export const heroSubtitle =
  'Modelos preditivos, análise de dados e sistemas inteligentes que geram impacto real para o seu negócio.'

export const heroCta = {
  label: 'Explorar Projetos',
  target: 'projetos',
  icon: 'bi-arrow-down-short',
}

export const heroResume = {
  label: 'Baixar Currículo',
  file: '/Curriculo.pdf',
  icon: 'bi-file-earmark-pdf',
}

export const servicesSection = {
  badge: 'O que eu faço',
  title: 'Meus Serviços',
}

export const services = [
  {
    icon: 'bi-cpu',
    title: 'Modelos Preditivos',
    description:
      'Desenvolvimento de modelos de Machine Learning e Deep Learning para previsão de séries temporais, classificação e regressão com validação rigorosa.',
    gradient: 'from-cyan-500/20 to-blue-600/20',
    border: 'border-cyan-500/30',
    iconColor: 'text-cyan-400',
  },
  {
    icon: 'bi-bar-chart-line',
    title: 'Análise de Dados',
    description:
      'Extração de insights a partir de grandes volumes de dados. Dashboards interativos, ETL pipelines e storytelling orientado a dados.',
    gradient: 'from-violet-500/20 to-purple-600/20',
    border: 'border-violet-500/30',
    iconColor: 'text-violet-400',
  },
  {
    icon: 'bi-eye',
    title: 'Visão Computacional',
    description:
      'Sistemas de detecção de objetos, segmentação semântica e classificação de imagens utilizando redes convolucionais e modelos estado-da-arte.',
    gradient: 'from-emerald-500/20 to-teal-600/20',
    border: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
  },
]

export const projectsSection = {
  badge: 'Mapa interativo',
  title: 'Projetos e Habilidades',
  description:
    'Explore o grafo interativo abaixo. Clique nos nós para ver detalhes de cada projeto e as tecnologias utilizadas.',
  badgeColor: 'text-violet-400',
}

export const contactSection = {
  badge: 'Vamos conversar',
  title: 'Contato',
  badgeColor: 'text-cyan-400',
}

export const contactForm = {
  name: {
    label: 'Nome',
    placeholder: 'Seu nome',
    id: 'contact-name',
  },
  email: {
    label: 'Email',
    placeholder: 'seu@email.com',
    id: 'contact-email',
  },
  message: {
    label: 'Mensagem',
    placeholder: 'Como posso ajudar?',
    id: 'contact-message',
  },
  submitLabel: 'Enviar Mensagem',
  sendingLabel: 'Enviando...',
  successMessage: 'Mensagem enviada com sucesso!',
  errorGeneric: 'Erro ao enviar. Tente novamente.',
}

export const apiConfig = {
  baseUrl: '',
  endpoints: {
    contact: '/api/contact',
  },
}

export const socialLinks = [
  {
    href: 'https://github.com/MatheusMFaccin',
    icon: 'bi bi-github',
    label: 'GitHub',
    hoverColor: 'hover:text-white',
    hoverBorder: 'hover:border-gray-600',
    hoverBg: 'hover:bg-gray-800',
  },
  {
    href: 'https://www.linkedin.com/in/matheus-faccin-407ba0219/',
    icon: 'bi bi-linkedin',
    label: 'LinkedIn',
    hoverColor: 'hover:text-blue-400',
    hoverBorder: 'hover:border-blue-500/30',
    hoverBg: 'hover:bg-blue-500/10',
  },
  {
    href: 'https://www.instagram.com/matheusmfaccin/',
    icon: 'bi bi-instagram',
    label: 'Instagram',
    hoverColor: 'hover:text-pink-400',
    hoverBorder: 'hover:border-pink-500/30',
    hoverBg: 'hover:bg-pink-500/10',
  },
  {
    href: 'mailto:faccinmatheus@gmail.com',
    icon: 'bi bi-envelope',
    label: 'Email',
    hoverColor: 'hover:text-cyan-400',
    hoverBorder: 'hover:border-cyan-500/30',
    hoverBg: 'hover:bg-cyan-500/10',
  },
]

export const footer = {
  copyright: '© 2026 Matheus Faccin. Todos os direitos reservados.',
  madeWith: 'Feito com',
  icon: 'bi bi-heart-fill',
  iconColor: 'text-red-500/60',
  suffix: 'e muito café',
}

/* ───────────────────────────────────────────────────────
   hud/sections — text data for the orphaned section
   components (ProfileHeader, AboutMe, TechStack,
   ProjectsList, ServicesList, ContactInfo)
   ─────────────────────────────────────────────────────── */

export const profileHeaderData = {
  initials: 'MF',
  name: 'Matheus Faccin',
  role: 'Desenvolvedor Full-Stack · ML · DevOps',
}

export const aboutMeData = {
  title: 'Sobre Mim',
  paragraphs: [
    'Desenvolvedor Full-Stack especializado em Python, Django e FastAPI, com atuação em Ciência de Dados, Machine Learning e infraestrutura DevOps. Crio plataformas completas — do banco de dados à interface — focadas em resolver problemas de negócio complexos com tecnologia de ponta.',
    'Este portfólio utiliza Vue 3, ECharts-GL e TailwindCSS para entregar uma visualização interativa de dados geoespaciais.',
  ],
}

export const techStackSection = {
  title: 'Tecnologias',
}

export const projectsListSection = {
  title: 'Projetos',
  githubLabel: 'GitHub',
}

export const servicesListSection = {
  title: 'Serviços',
}

export const contactInfoSection = {
  title: 'Contato',
}
