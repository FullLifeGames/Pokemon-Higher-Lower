import type { Species } from '@pkmn/dex'
import type { GuessMode } from '@/dex-util'
import {
  getFilteredSpecies,
  getGuessValue,
  getRandomPokemon,
  getRandomPokemonExcluding,
} from '@/dex-util'

export type GamePhase = 'menu' | 'playing' | 'revealing' | 'gameover'

export type HighScores = Record<GuessMode, number>

const defaultHighScores: HighScores = {
  weight: 0,
  bst: 0,
  hp: 0,
  attack: 0,
  defense: 0,
  specialAttack: 0,
  specialDefense: 0,
  speed: 0,
}

export function useGame() {
  const phase = ref<GamePhase>('menu')
  const score = ref(0)
  const highScores = useLocalStorage<HighScores>('pokemon-hl-highscores', { ...defaultHighScores })

  const highScore = computed(() => highScores.value[guessMode.value])

  // Configuration
  const guessMode = ref<GuessMode>('weight')
  const generation = ref(9)
  const minGeneration = ref(1)
  const maxGeneration = ref(9)
  const fullyEvolvedOnly = ref(false)

  // Pokémon state
  const currentPokemon = shallowRef<Species | null>(null)
  const nextPokemon = shallowRef<Species | null>(null)
  const lastGuessCorrect = ref<boolean | null>(null)
  const isTransitioning = ref(false)

  const speciesList = computed(() =>
    getFilteredSpecies({
      generation: generation.value,
      minGeneration: minGeneration.value,
      maxGeneration: maxGeneration.value,
      fullyEvolvedOnly: fullyEvolvedOnly.value,
      guessMode: guessMode.value,
    }),
  )

  const canStart = computed(() => speciesList.value.length >= 2)

  function startGame() {
    if (!canStart.value) return
    score.value = 0
    lastGuessCorrect.value = null
    isTransitioning.value = false
    const first = getRandomPokemon(speciesList.value)
    currentPokemon.value = first
    nextPokemon.value = getRandomPokemonExcluding(speciesList.value, first.num)
    phase.value = 'playing'
  }

  function makeGuess(choice: 'higher' | 'lower') {
    if (!currentPokemon.value || !nextPokemon.value || phase.value !== 'playing') return

    const currentVal = getGuessValue(currentPokemon.value, guessMode.value)
    const nextVal = getGuessValue(nextPokemon.value, guessMode.value)

    const correct =
      choice === 'higher' ? nextVal >= currentVal : nextVal <= currentVal

    lastGuessCorrect.value = correct
    phase.value = 'revealing'

    const revealDelay = correct ? 1500 : 2000

    setTimeout(() => {
      if (correct) {
        score.value++
        isTransitioning.value = true

        setTimeout(() => {
          currentPokemon.value = nextPokemon.value
          nextPokemon.value = getRandomPokemonExcluding(
            speciesList.value,
            currentPokemon.value!.num,
          )
          phase.value = 'playing'
          lastGuessCorrect.value = null

          nextTick(() => {
            isTransitioning.value = false
          })
        }, 300)
      } else {
        if (score.value > highScores.value[guessMode.value]) {
          highScores.value[guessMode.value] = score.value
        }
        phase.value = 'gameover'
      }
    }, revealDelay)
  }

  function goToMenu() {
    phase.value = 'menu'
    lastGuessCorrect.value = null
    isTransitioning.value = false
    currentPokemon.value = null
    nextPokemon.value = null
  }

  return {
    phase,
    score,
    highScore,
    highScores,
    guessMode,
    generation,
    minGeneration,
    maxGeneration,
    fullyEvolvedOnly,
    currentPokemon,
    nextPokemon,
    lastGuessCorrect,
    isTransitioning,
    speciesList,
    canStart,
    startGame,
    makeGuess,
    goToMenu,
  }
}
