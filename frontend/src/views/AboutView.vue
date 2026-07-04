<script setup>
</script>

<template>
  <div class="w-full min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-8 transition-colors duration-300">
    <div class="max-w-2xl w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm">
      
      <router-link
        to="/"
        class="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-8"
      >
        <i class="bi bi-arrow-left"></i>
        Voltar
      </router-link>

      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Sobre Mim
      </h1>

      <div class="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
        <p>
          Desenvolvedor Full-Stack especializado em Python, Django e FastAPI,
          com atuação em Ciência de Dados, Machine Learning e infraestrutura DevOps.
          Crio plataformas completas — do banco de dados à interface — focadas
          em resolver problemas de negócio complexos com tecnologia de ponta.
        </p>

        <p>
          Este portfólio utiliza 
          <strong class="text-gray-900 dark:text-gray-200 font-medium">Vue 3</strong>,
          <strong class="text-gray-900 dark:text-gray-200 font-medium">ECharts-GL</strong>
          e <strong class="text-gray-900 dark:text-gray-200 font-medium">TailwindCSS</strong> para entregar 
          uma experiência interativa de visualização de dados geoespaciais.
        </p>
      </div>
    </div>
  </div>
</template>
