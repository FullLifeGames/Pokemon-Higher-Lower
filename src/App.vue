<script setup lang="ts">
import { useGame } from '@/composables/useGame'
import GameMenu from '@/components/GameMenu.vue'
import GameBoard from '@/components/GameBoard.vue'
import GameOver from '@/components/GameOver.vue'

const {
  phase,
  score,
  highScore,
  highScores,
  guessMode,
  minGeneration,
  maxGeneration,
  fullyEvolvedOnly,
  currentPokemon,
  nextPokemon,
  lastGuessCorrect,
  isTransitioning,
  canStart,
  startGame,
  makeGuess,
  goToMenu,
} = useGame()
</script>

<template>
  <div class="min-h-dvh bg-[#14141f]">
    <!-- Menu -->
    <Transition name="fade" mode="out-in">
      <GameMenu
        v-if="phase === 'menu'"
        v-model:guessMode="guessMode"
        v-model:minGeneration="minGeneration"
        v-model:maxGeneration="maxGeneration"
        v-model:fullyEvolvedOnly="fullyEvolvedOnly"
        :can-start="canStart"
        :high-scores="highScores"
        @start="startGame()"
      />

      <!-- Game Board -->
      <GameBoard
        v-else-if="currentPokemon && nextPokemon"
        :phase="phase"
        :score="score"
        :high-score="highScore"
        :guess-mode="guessMode"
        :current-pokemon="currentPokemon"
        :next-pokemon="nextPokemon"
        :last-guess-correct="lastGuessCorrect"
        :is-transitioning="isTransitioning"
        @guess="makeGuess($event)"
      />
    </Transition>

    <!-- Game Over Overlay -->
    <GameOver
      v-if="phase === 'gameover'"
      :score="score"
      :high-score="highScore"
      :guess-mode="guessMode"
      @play-again="startGame()"
      @back-to-menu="goToMenu()"
    />
  </div>
</template>

<style scoped>
</style>
