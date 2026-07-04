<script setup>
import { ref, onMounted } from 'vue'

import NavBar from '../components/home/NavBar.vue'
import HeroSection from '../components/home/HeroSection.vue'
import ServicesSection from '../components/home/ServicesSection.vue'
import ProjectsSection from '../components/home/ProjectsSection.vue'
import ContactSection from '../components/home/ContactSection.vue'

/* ── Navbar scroll state ── */
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)

onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 40
  })
})

function scrollTo(id) {
  mobileMenuOpen.value = false
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="min-h-screen text-gray-100 font-sans antialiased">
    <NavBar
      :is-scrolled="isScrolled"
      :mobile-menu-open="mobileMenuOpen"
      @scroll-to="scrollTo"
      @toggle-menu="mobileMenuOpen = !mobileMenuOpen"
    />

    <HeroSection @scroll-to="scrollTo" />
    <ProjectsSection />
    <ContactSection />
  </div>
</template>
