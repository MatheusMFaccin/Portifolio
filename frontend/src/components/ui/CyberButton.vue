<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'ghost'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-xs',
  lg: 'px-6 py-3 text-sm',
}

const variantClasses = {
  primary: 'text-[#0284c7] border-[rgba(2,132,199,0.15)] hover:bg-[rgba(2,132,199,0.08)] hover:border-[rgba(2,132,199,0.3)]',
  secondary: 'text-[#9333ea] border-[rgba(147,51,234,0.15)] hover:bg-[rgba(147,51,234,0.08)] hover:border-[rgba(147,51,234,0.3)]',
  ghost: 'text-[#64748b] border-transparent hover:text-[#0f172a] hover:bg-[rgba(2,132,199,0.05)]',
}
</script>

<template>
  <button
    class="relative inline-flex items-center gap-2 font-[JetBrains_Mono] font-medium tracking-[0.08em] cursor-pointer border rounded-lg bg-transparent overflow-hidden transition-all duration-200 disabled:opacity-35 disabled:cursor-not-allowed disabled:pointer-events-none"
    :class="[sizeClasses[size], variantClasses[variant]]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <span class="relative z-[1]">
      <slot />
    </span>
  </button>
</template>
