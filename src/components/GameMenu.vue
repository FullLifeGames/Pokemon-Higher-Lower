<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { GuessMode } from '@/dex-util'

const { t } = useI18n()

const props = defineProps<{
  guessMode: GuessMode
  minGeneration: number
  maxGeneration: number
  fullyEvolvedOnly: boolean
  canStart: boolean
  highScoreWeight: number
  highScoreBst: number
}>()

const emit = defineEmits<{
  'update:guessMode': [value: GuessMode]
  'update:minGeneration': [value: number]
  'update:maxGeneration': [value: number]
  'update:fullyEvolvedOnly': [value: boolean]
  start: []
}>()

const locale = useI18n().locale

const activeHighScore = computed(() =>
  props.guessMode === 'weight' ? props.highScoreWeight : props.highScoreBst
)
</script>

<template>
  <div class="menu-wrapper flex flex-col items-center bg-[#14141f] p-6 pt-16 text-white relative">
    <!-- Subtle background pattern -->
    <div class="absolute inset-0 opacity-[0.04]" style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 40px 40px;" />

    <!-- Floating Pokéball outlines -->
    <div class="absolute -top-16 -left-16 w-48 h-48 rounded-full border border-white/[0.07] pokeball-float" />
    <div class="absolute -bottom-24 -right-24 w-72 h-72 rounded-full border border-white/[0.05] pokeball-float-slow" />
    <div class="absolute top-1/3 right-[8%] w-14 h-14 rounded-full border border-white/[0.08] pokeball-float" />

    <!-- Top bar: language + high score -->
    <div class="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
      <!-- High score badge -->
      <div v-if="activeHighScore > 0" class="flex items-center gap-2 text-xs text-white/40 font-mono">
        <span class="inline-block w-1.5 h-1.5 rounded-full bg-amber-400/60" />
        {{ t('game.highScore') }}: {{ activeHighScore }}
      </div>
      <div v-else />
      <!-- Language toggle -->
      <button
        class="text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer tracking-wider uppercase font-medium"
        @click="locale = locale === 'en' ? 'de' : 'en'"
      >
        {{ locale === 'en' ? 'DE' : 'EN' }}
      </button>
    </div>

    <!-- Main content (centered) -->
    <div class="flex-1 flex flex-col items-center justify-center w-full">

    <!-- Title -->
    <div class="text-center mb-12 relative z-10">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3 leading-normal bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
        {{ t('game.title') }}
      </h1>
      <p class="text-sm md:text-base text-white/50 max-w-sm mx-auto leading-relaxed">
        {{ t('game.subtitle') }}
      </p>
    </div>

    <!-- Card -->
    <div class="w-full max-w-sm space-y-5 relative z-10">
      <!-- Mode selection -->
      <div>
        <label class="block text-[11px] font-medium mb-2.5 uppercase tracking-[0.15em] text-white/40">
          {{ t('mode.select') }}
        </label>
        <div class="grid grid-cols-2 gap-2">
          <button
            class="relative px-4 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer border"
            :class="guessMode === 'weight'
              ? 'bg-white/[0.08] border-white/20 text-white shadow-lg shadow-white/[0.03]'
              : 'bg-transparent border-white/[0.06] text-white/40 hover:border-white/10 hover:text-white/60'"
            @click="emit('update:guessMode', 'weight')"
          >
            <span class="flex items-center justify-center gap-2">
              <span class="text-base">⚖️</span>
              {{ t('mode.weight') }}
            </span>
            <span v-if="guessMode === 'weight'" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-red-400/80" />
          </button>
          <button
            class="relative px-4 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer border"
            :class="guessMode === 'bst'
              ? 'bg-white/[0.08] border-white/20 text-white shadow-lg shadow-white/[0.03]'
              : 'bg-transparent border-white/[0.06] text-white/40 hover:border-white/10 hover:text-white/60'"
            @click="emit('update:guessMode', 'bst')"
          >
            <span class="flex items-center justify-center gap-2">
              <span class="text-base">📊</span>
              {{ t('mode.bst') }}
            </span>
            <span v-if="guessMode === 'bst'" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-blue-400/80" />
          </button>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-white/[0.07]" />

      <!-- Generation range -->
      <div>
        <label class="block text-[11px] font-medium mb-2.5 uppercase tracking-[0.15em] text-white/40">
          {{ t('settings.genRange') }}
        </label>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-[10px] text-white/30 mb-1 uppercase tracking-wider">{{ t('settings.minGen') }}</label>
            <select
              class="w-full bg-white/[0.05] rounded-lg px-3 py-2.5 text-white/80 border border-white/[0.08] cursor-pointer appearance-none text-center text-sm font-medium focus:outline-none focus:border-white/20 transition-colors"
              :value="minGeneration"
              @change="emit('update:minGeneration', Number(($event.target as HTMLSelectElement).value))"
            >
              <option v-for="g in 9" :key="g" :value="g" class="bg-[#1a1a2e] text-white">Gen {{ g }}</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] text-white/30 mb-1 uppercase tracking-wider">{{ t('settings.maxGen') }}</label>
            <select
              class="w-full bg-white/[0.05] rounded-lg px-3 py-2.5 text-white/80 border border-white/[0.08] cursor-pointer appearance-none text-center text-sm font-medium focus:outline-none focus:border-white/20 transition-colors"
              :value="maxGeneration"
              @change="emit('update:maxGeneration', Number(($event.target as HTMLSelectElement).value))"
            >
              <option v-for="g in 9" :key="g" :value="g" class="bg-[#1a1a2e] text-white">Gen {{ g }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Fully evolved toggle -->
      <div class="flex items-center justify-between py-1">
        <label class="text-sm text-white/60 cursor-pointer">
          {{ t('settings.fullyEvolved') }}
        </label>
        <button
          class="relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer"
          :class="fullyEvolvedOnly ? 'bg-red-400/80' : 'bg-white/10'"
          @click="emit('update:fullyEvolvedOnly', !fullyEvolvedOnly)"
        >
          <span
            class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm duration-200"
            :class="fullyEvolvedOnly ? 'translate-x-5' : ''"
          />
        </button>
      </div>

      <!-- Divider -->
      <div class="border-t border-white/[0.07]" />

      <!-- Start button -->
      <button
        :disabled="!canStart"
        class="w-full py-4 rounded-xl text-base font-bold tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        :class="guessMode === 'weight'
          ? 'bg-gradient-to-r from-red-500/90 to-red-600/90 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-500/20'
          : 'bg-gradient-to-r from-blue-500/90 to-blue-600/90 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg shadow-blue-500/20'"
        @click="emit('start')"
      >
        {{ t('game.start') }}
      </button>
    </div>

    </div><!-- end centered content -->

    <!-- Footer Links -->
    <footer class="mt-auto pt-8 pb-4 relative z-10">
      <div class="text-xs text-white/40 flex flex-col items-center gap-1">
        <div>
          {{ t('sidebar.basedOn') }}
          <a href="https://www.higherlowergame.com/" target="_blank" rel="noopener noreferrer" class="hover:text-white/70 transition-colors font-medium">The Higher Lower Game</a>
        </div>
        <div class="flex items-center gap-2">
          <a href="https://fulllifegames.com" target="_blank" rel="noopener noreferrer" class="hover:text-white/70 transition-colors">fulllifegames.com</a>
          <span class="text-white/20">·</span>
          <a href="https://github.com/FullLifeGames/Pokemon-Higher-Lower" target="_blank" rel="noopener noreferrer" class="hover:text-white/70 transition-colors flex items-center gap-1">
            <svg class="w-3 h-3" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
            GitHub
          </a>
        </div>
        <div>
          {{ t('sidebar.madeBy') }}
          <a href="https://youtube.com/@Bene" target="_blank" rel="noopener noreferrer" class="hover:text-white/70 transition-colors font-medium">Bene</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.menu-wrapper {
  height: 100dvh;
  overflow-y: auto;
  overflow-x: hidden;
}

@media (orientation: landscape) and (max-height: 500px) {
  .menu-wrapper {
    height: auto;
    min-height: 100dvh;
    overflow-y: auto;
    padding-bottom: 2rem;
  }
}

@keyframes pokeball-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(6deg); }
}
@keyframes pokeball-float-slow {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(-4deg); }
}
.pokeball-float { animation: pokeball-float 8s ease-in-out infinite; }
.pokeball-float-slow { animation: pokeball-float-slow 12s ease-in-out infinite; }
</style>
