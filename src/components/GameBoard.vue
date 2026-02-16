<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Species } from '@pkmn/dex'
import type { GuessMode } from '@/dex-util'
import type { GamePhase } from '@/composables/useGame'
import { getSpriteUrl, getGuessValue, getGuessUnit, getTypeGradient } from '@/dex-util'
import { getLocalizedPokemonName } from '@/lib/pokemonNameHelper'

const { t, locale } = useI18n()

const props = defineProps<{
  phase: GamePhase
  score: number
  highScore: number
  guessMode: GuessMode
  currentPokemon: Species
  nextPokemon: Species
  lastGuessCorrect: boolean | null
  isTransitioning: boolean
}>()

const emit = defineEmits<{
  guess: [choice: 'higher' | 'lower']
  backToMenu: []
}>()

const currentValue = computed(() => getGuessValue(props.currentPokemon, props.guessMode))
const nextValue = computed(() => getGuessValue(props.nextPokemon, props.guessMode))
const unit = computed(() => getGuessUnit(props.guessMode))
const modeLabel = computed(() => t(`mode.${props.guessMode}`))

// Animated value for reveal
const displayValue = ref(0)

watch(() => props.phase, (newPhase) => {
  if (newPhase === 'revealing') {
    const target = nextValue.value
    const duration = 1000
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      displayValue.value = Number((target * eased).toFixed(1))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        displayValue.value = target
      }
    }
    requestAnimationFrame(animate)
  } else if (newPhase === 'playing') {
    displayValue.value = 0
  }
})

const currentGradient = computed(() => getTypeGradient(props.currentPokemon.types))
const nextGradient = computed(() => getTypeGradient(props.nextPokemon.types))

// Image loading states
const currentImgLoaded = ref(false)
const nextImgLoaded = ref(false)

watch(() => props.currentPokemon.num, () => {
  currentImgLoaded.value = false
})
watch(() => props.nextPokemon.num, () => {
  nextImgLoaded.value = false
})

const currentName = computed(() => getLocalizedPokemonName(props.currentPokemon.name, locale.value))
const nextName = computed(() => getLocalizedPokemonName(props.nextPokemon.name, locale.value))
</script>

<template>
  <div
    class="h-dvh w-full flex flex-col landscape:flex-row md:flex-row relative overflow-hidden transition-opacity duration-300"
    :class="{ 'opacity-0': isTransitioning }"
  >
    <!-- Back button -->
    <button
      class="absolute top-2 md:top-4 left-2 md:left-4 z-30 bg-black/50 backdrop-blur-md rounded-full p-2 md:p-3 shadow-lg hover:bg-black/70 transition-colors group cursor-pointer"
      :title="t('game.backToMenu')"
      @click="emit('backToMenu')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 md:w-5 md:h-5 text-white/70 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
    </button>

    <!-- Score bar -->
    <div class="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 md:gap-3 bg-black/50 backdrop-blur-md rounded-full px-3 md:px-5 py-1 landscape:py-1 md:py-2 shadow-lg">
      <span class="text-white/70 text-[10px] md:text-xs font-semibold uppercase tracking-wider">{{ t('game.score') }}</span>
      <span class="text-white text-lg md:text-2xl font-black tabular-nums">{{ score }}</span>
      <span class="text-white/30">|</span>
      <span class="text-white/70 text-[10px] md:text-xs font-semibold uppercase tracking-wider">{{ t('game.highScore') }}</span>
      <span class="text-yellow-300 text-sm md:text-lg font-bold tabular-nums">{{ highScore }}</span>
    </div>

    <!-- Left panel - Current Pokémon (known value) -->
    <div
      class="flex-1 flex flex-col items-center justify-center relative px-4 pt-10 pb-4 landscape:pt-8 landscape:pb-2 landscape:px-3 md:p-8 min-h-0 md:min-h-full"
      :style="{ background: currentGradient }"
    >
      <div class="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
      <div class="relative z-10 flex flex-col items-center text-white text-center">
        <div class="relative">
          <div
            v-if="!currentImgLoaded"
            class="w-24 h-24 sm:w-32 sm:h-32 landscape:w-20 landscape:h-20 landscape:md:w-48 landscape:md:h-48 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full bg-white/10 animate-pulse"
          />
          <img
            :src="getSpriteUrl(currentPokemon)"
            :alt="currentName"
            class="w-24 h-24 sm:w-32 sm:h-32 landscape:w-20 landscape:h-20 landscape:md:w-48 landscape:md:h-48 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain drop-shadow-2xl select-none pokemon-sprite"
            :class="{ 'opacity-0 absolute': !currentImgLoaded }"
            draggable="false"
            @load="currentImgLoaded = true"
          >
        </div>
        <h2 class="text-xl sm:text-2xl landscape:text-base landscape:md:text-4xl md:text-4xl font-black mt-2 landscape:mt-1 md:mt-3 mb-1 landscape:mb-0.5 md:mb-2 drop-shadow-lg">
          {{ currentName }}
        </h2>
        <p class="text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-70 mb-0.5 landscape:hidden md:block">{{ t('guess.has') }}</p>
        <div class="flex items-baseline gap-1.5 md:gap-2">
          <span class="text-3xl sm:text-4xl landscape:text-2xl landscape:md:text-6xl md:text-6xl lg:text-7xl font-black drop-shadow-lg tabular-nums">
            {{ currentValue }}
          </span>
          <span class="text-base landscape:text-sm md:text-2xl font-bold opacity-80">{{ unit }}</span>
        </div>
        <p class="text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-70 mt-0.5">{{ modeLabel }}</p>
      </div>
    </div>

    <!-- VS Circle -->
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
      <div
        class="w-11 h-11 landscape:w-9 landscape:h-9 landscape:md:w-16 landscape:md:h-16 md:w-16 md:h-16 rounded-full flex items-center justify-center font-black text-xs md:text-lg shadow-2xl border-[3px] md:border-4 transition-all duration-500"
        :class="{
          'bg-white text-gray-800 border-white/80': lastGuessCorrect === null,
          'bg-green-500 text-white border-green-300 scale-110': lastGuessCorrect === true,
          'bg-red-500 text-white border-red-300 scale-110': lastGuessCorrect === false,
        }"
      >
        <template v-if="lastGuessCorrect === null">{{ t('game.vs') }}</template>
        <template v-else-if="lastGuessCorrect">✓</template>
        <template v-else>✗</template>
      </div>
    </div>

    <!-- Right panel - Next Pokémon (guess / reveal) -->
    <div
      class="flex-1 flex flex-col items-center justify-center relative px-4 pt-4 pb-4 landscape:pt-2 landscape:pb-2 landscape:px-3 md:p-8 min-h-0 md:min-h-full"
      :style="{ background: nextGradient }"
    >
      <div class="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />

      <!-- Correct/Wrong overlay flash -->
      <Transition name="fade">
        <div
          v-if="lastGuessCorrect !== null"
          class="absolute inset-0 z-10 pointer-events-none"
          :class="lastGuessCorrect ? 'bg-green-500/20' : 'bg-red-500/20'"
        />
      </Transition>

      <div class="relative z-10 flex flex-col items-center text-white text-center">
        <div class="relative">
          <div
            v-if="!nextImgLoaded"
            class="w-24 h-24 sm:w-32 sm:h-32 landscape:w-20 landscape:h-20 landscape:md:w-48 landscape:md:h-48 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full bg-white/10 animate-pulse"
          />
          <img
            :src="getSpriteUrl(nextPokemon)"
            :alt="nextName"
            class="w-24 h-24 sm:w-32 sm:h-32 landscape:w-20 landscape:h-20 landscape:md:w-48 landscape:md:h-48 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain drop-shadow-2xl select-none pokemon-sprite"
            :class="{ 'opacity-0 absolute': !nextImgLoaded }"
            draggable="false"
            @load="nextImgLoaded = true"
          >
        </div>
        <h2 class="text-xl sm:text-2xl landscape:text-base landscape:md:text-4xl md:text-4xl font-black mt-2 landscape:mt-1 md:mt-3 mb-2 landscape:mb-3 md:mb-4 drop-shadow-lg">
          {{ nextName }}
        </h2>

        <!-- Guess buttons (playing state) -->
        <template v-if="phase === 'playing'">
          <p class="text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-70 mb-2 landscape:mb-1 md:mb-3 landscape:hidden md:block">{{ t('guess.has') }}</p>
          <button
            class="w-40 sm:w-48 md:w-52 landscape:w-36 landscape:md:w-52 py-2 landscape:py-1.5 md:py-3 mb-1.5 md:mb-2 rounded-xl bg-green-500/90 hover:bg-green-400 text-white font-black text-base landscape:text-sm landscape:md:text-xl md:text-xl shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm border border-green-400/30"
            @click="emit('guess', 'higher')"
          >
            ▲ {{ t('guess.higher') }}
          </button>
          <p class="text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-50 my-0.5 md:my-1 landscape:hidden md:block">{{ t('guess.or') }}</p>
          <button
            class="w-40 sm:w-48 md:w-52 landscape:w-36 landscape:md:w-52 py-2 landscape:py-1.5 md:py-3 mt-0.5 landscape:mt-0 md:mt-1 rounded-xl bg-red-500/90 hover:bg-red-400 text-white font-black text-base landscape:text-sm landscape:md:text-xl md:text-xl shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm border border-red-400/30"
            @click="emit('guess', 'lower')"
          >
            ▼ {{ t('guess.lower') }}
          </button>
          <p class="text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-50 mt-2 md:mt-3 landscape:mt-1">
            {{ modeLabel }} {{ t('guess.than') }} {{ currentName }}
          </p>
        </template>

        <!-- Revealed value -->
        <template v-else>
          <p class="text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-70 mb-0.5 landscape:hidden md:block">{{ t('guess.has') }}</p>
          <div class="flex items-baseline gap-1.5 md:gap-2">
            <span class="text-3xl sm:text-4xl landscape:text-2xl landscape:md:text-6xl md:text-6xl lg:text-7xl font-black drop-shadow-lg tabular-nums value-reveal">
              {{ displayValue }}
            </span>
            <span class="text-base landscape:text-sm md:text-2xl font-bold opacity-80">{{ unit }}</span>
          </div>
          <p class="text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-70 mt-0.5">{{ modeLabel }}</p>
          <p
            class="mt-2 landscape:mt-1 md:mt-4 text-lg landscape:text-base md:text-2xl font-black drop-shadow-lg animate-bounce"
            :class="lastGuessCorrect ? 'text-green-300' : 'text-red-300'"
          >
            {{ lastGuessCorrect ? t('game.correct') : t('game.wrong') }}
          </p>
        </template>
      </div>
    </div>
  </div>
</template>
