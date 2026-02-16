<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { GuessMode } from '@/dex-util'

const { t } = useI18n()

const props = defineProps<{
  score: number
  highScore: number
  guessMode: GuessMode
}>()

const emit = defineEmits<{
  playAgain: []
  backToMenu: []
}>()

const buttonClass = computed(() => {
  switch (props.guessMode) {
    case 'weight':
      return 'bg-red-500/90 hover:bg-red-500 text-white shadow-lg shadow-red-500/20'
    case 'height':
      return 'bg-emerald-600/90 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
    case 'bst':
      return 'bg-blue-500/90 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
    case 'hp':
      return 'bg-pink-500/90 hover:bg-pink-500 text-white shadow-lg shadow-pink-500/20'
    case 'attack':
      return 'bg-orange-500/90 hover:bg-orange-500 text-white shadow-lg shadow-orange-500/20'
    case 'defense':
      return 'bg-yellow-500/90 hover:bg-yellow-500 text-white shadow-lg shadow-yellow-500/20'
    case 'specialAttack':
      return 'bg-purple-500/90 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20'
    case 'specialDefense':
      return 'bg-green-500/90 hover:bg-green-500 text-white shadow-lg shadow-green-500/20'
    case 'speed':
      return 'bg-cyan-500/90 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
  }
})
</script>

<template>
  <Transition name="fade">
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div class="bg-[#1a1a2e] border border-white/10 rounded-2xl p-8 md:p-10 text-center shadow-2xl max-w-sm w-full game-over-card">
        <div class="text-5xl mb-4">😵</div>
        <h2 class="text-2xl md:text-3xl font-black text-white mb-1">
          {{ t('game.gameOver') }}
        </h2>
        <p class="text-white/30 text-xs uppercase tracking-[0.15em] mb-5">{{ t(`mode.${guessMode}`) }}</p>
        <p class="text-6xl md:text-7xl font-black tabular-nums mb-1"
          :class="{
            'text-red-400': guessMode === 'weight',
            'text-emerald-400': guessMode === 'height',
            'text-blue-400': guessMode === 'bst',
            'text-pink-400': guessMode === 'hp',
            'text-orange-400': guessMode === 'attack',
            'text-yellow-400': guessMode === 'defense',
            'text-purple-400': guessMode === 'specialAttack',
            'text-green-400': guessMode === 'specialDefense',
            'text-cyan-400': guessMode === 'speed',
          }"
        >
          {{ score }}
        </p>
        <p class="text-xs text-white/30 uppercase tracking-wider mb-6">{{ t('game.score') }}</p>
        <p class="text-sm text-white/40 mb-8">
          {{ t('game.highScore') }}: <span class="font-bold text-amber-400">{{ highScore }}</span>
        </p>
        <div class="space-y-2.5">
          <button
            class="w-full py-3 rounded-xl text-sm font-bold cursor-pointer transition-all"
            :class="buttonClass"
            @click="emit('playAgain')"
          >
            {{ t('game.playAgain') }}
          </button>
          <button
            class="w-full py-3 rounded-xl text-sm font-medium cursor-pointer bg-white/[0.06] border border-white/[0.08] text-white/60 hover:text-white/80 hover:bg-white/[0.1] transition-all"
            @click="emit('backToMenu')"
          >
            {{ t('game.backToMenu') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.game-over-card {
  animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes pop-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
