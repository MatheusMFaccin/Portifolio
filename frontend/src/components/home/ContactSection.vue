<script setup>
import { ref } from 'vue'
import { contactSection, contactForm, apiConfig, socialLinks, footer } from '../../data/homeData.js'

// ─── Estado do formulário ──
const name = ref('')
const email = ref('')
const message = ref('')
const status = ref('idle') // idle | sending | success | error
const statusMsg = ref('')

async function handleSubmit() {
  if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
    status.value = 'error'
    statusMsg.value = 'Preencha todos os campos.'
    return
  }

  status.value = 'sending'
  statusMsg.value = ''

  try {
    const resp = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.contact}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN}`,
      },
      body: JSON.stringify({
        name: name.value.trim(),
        email: email.value.trim(),
        message: message.value.trim(),
      }),
    })

    if (!resp.ok) {
      const errData = await resp.json().catch(() => null)
      throw new Error(errData?.detail || `Erro ${resp.status}`)
    }

    status.value = 'success'
    statusMsg.value = contactForm.successMessage
    name.value = ''
    email.value = ''
    message.value = ''
  } catch (e) {
    status.value = 'error'
    statusMsg.value = e.message || contactForm.errorGeneric
  }
}
</script>

<template>
  <footer id="contato" class="relative z-10 pt-20 pb-12 bg-[#030712] shadow-[0_-30px_60px_-15px_rgba(0,0,0,0.7)]">
    <!-- Curtain top glow -->
    <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <!-- Section Header -->
      <div class="text-center mb-14">
        <span class="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-3" :class="contactSection.badgeColor">
          {{ contactSection.badge }}
        </span>
        <h2 class="text-3xl md:text-4xl font-bold text-white text-center">
          {{ contactSection.title }}
        </h2>
      </div>

      <!-- Contact Form -->
      <div class="max-w-2xl mx-auto w-full">
        <form @submit.prevent="handleSubmit" class="space-y-5 mb-16 text-center">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div class="text-center">
              <label
                :for="contactForm.name.id"
                class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2"
              >
                {{ contactForm.name.label }}
              </label>
              <input
                :id="contactForm.name.id"
                v-model="name"
                type="text"
                :placeholder="contactForm.name.placeholder"
                class="block w-full px-4 py-3 rounded-xl bg-gray-800/60 border border-gray-700/50 text-gray-200 placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-colors"
              />
            </div>
            <div class="text-center">
              <label
                :for="contactForm.email.id"
                class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2"
              >
                {{ contactForm.email.label }}
              </label>
              <input
                :id="contactForm.email.id"
                v-model="email"
                type="email"
                :placeholder="contactForm.email.placeholder"
                class="block w-full px-4 py-3 rounded-xl bg-gray-800/60 border border-gray-700/50 text-gray-200 placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-colors"
              />
            </div>
          </div>
          <div class="text-center">
            <label
              :for="contactForm.message.id"
              class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2"
            >
              {{ contactForm.message.label }}
            </label>
            <textarea
              :id="contactForm.message.id"
              v-model="message"
              rows="5"
              :placeholder="contactForm.message.placeholder"
              class="block w-full px-4 py-3 rounded-xl bg-gray-800/60 border border-gray-700/50 text-gray-200 placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-colors resize-none"
            />
          </div>

          <!-- Status message -->
          <div
            v-if="statusMsg"
            class="text-xs sm:text-sm font-medium transition-all duration-200"
            :class="status === 'success' ? 'text-emerald-400' : 'text-red-400'"
          >
            {{ statusMsg }}
          </div>

          <button
            type="submit"
            :disabled="status === 'sending'"
            class="w-full sm:w-auto mx-auto flex justify-center items-center px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm tracking-wide shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span v-if="status === 'sending'" class="flex items-center gap-2">
              <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ contactForm.sendingLabel }}
            </span>
            <span v-else>
              {{ contactForm.submitLabel }}
            </span>
          </button>
        </form>
      </div>

      <!-- Social Links -->
      <div class="flex justify-center gap-6 mt-8 mb-12">
        <a
          v-for="link in socialLinks"
          :key="link.label"
          :href="link.href"
          target="_blank"
          class="w-11 h-11 rounded-xl bg-gray-800/60 border border-gray-700/40 text-gray-500 flex items-center justify-center text-lg transition-all duration-200"
          :class="[link.hoverColor, link.hoverBorder, link.hoverBg]"
          :aria-label="link.label"
        >
          <i :class="link.icon" />
        </a>
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
