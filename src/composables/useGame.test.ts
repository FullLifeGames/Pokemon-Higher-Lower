import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useGame } from '@/composables/useGame'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('useGame', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllTimers()
  })

  describe('initialization', () => {
    it('should initialize with menu phase', () => {
      const game = useGame()
      expect(game.phase.value).toBe('menu')
    })

    it('should initialize score at 0', () => {
      const game = useGame()
      expect(game.score.value).toBe(0)
    })

    it('should initialize with default settings', () => {
      const game = useGame()
      expect(game.guessMode.value).toBe('weight')
      expect(game.generation.value).toBe(9)
      expect(game.minGeneration.value).toBe(1)
      expect(game.maxGeneration.value).toBe(9)
      expect(game.fullyEvolvedOnly.value).toBe(false)
    })

    it('should have null pokemon initially', () => {
      const game = useGame()
      expect(game.currentPokemon.value).toBeNull()
      expect(game.nextPokemon.value).toBeNull()
    })
  })

  describe('canStart', () => {
    it('should be true when there are enough species', () => {
      const game = useGame()
      expect(game.canStart.value).toBe(true)
      expect(game.speciesList.value.length).toBeGreaterThanOrEqual(2)
    })

    it('should update when filters change', () => {
      const game = useGame()
      game.minGeneration.value = 1
      game.maxGeneration.value = 1
      expect(game.canStart.value).toBe(true)
    })
  })

  describe('startGame', () => {
    it('should set phase to playing', () => {
      const game = useGame()
      game.startGame()
      expect(game.phase.value).toBe('playing')
    })

    it('should reset score to 0', () => {
      const game = useGame()
      game.score.value = 10
      game.startGame()
      expect(game.score.value).toBe(0)
    })

    it('should select two different pokemon', () => {
      const game = useGame()
      game.startGame()
      expect(game.currentPokemon.value).not.toBeNull()
      expect(game.nextPokemon.value).not.toBeNull()
      expect(game.currentPokemon.value?.num).not.toBe(game.nextPokemon.value?.num)
    })

    it('should reset lastGuessCorrect', () => {
      const game = useGame()
      game.lastGuessCorrect.value = true
      game.startGame()
      expect(game.lastGuessCorrect.value).toBeNull()
    })
  })

  describe('makeGuess', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should set phase to revealing after guess', () => {
      const game = useGame()
      game.startGame()
      game.makeGuess('higher')
      expect(game.phase.value).toBe('revealing')
    })

    it('should set lastGuessCorrect to true for correct guess', () => {
      const game = useGame()
      game.startGame()

      // Ensure we know which is higher
      const currentVal = game.currentPokemon.value!.weightkg
      const nextVal = game.nextPokemon.value!.weightkg

      if (nextVal >= currentVal) {
        game.makeGuess('higher')
      } else {
        game.makeGuess('lower')
      }

      expect(game.lastGuessCorrect.value).toBe(true)
    })

    it('should increment score on correct guess', async () => {
      const game = useGame()
      game.startGame()

      const currentVal = game.currentPokemon.value!.weightkg
      const nextVal = game.nextPokemon.value!.weightkg
      const initialScore = game.score.value

      if (nextVal >= currentVal) {
        game.makeGuess('higher')
      } else {
        game.makeGuess('lower')
      }

      // Wait for reveal delay + transition
      vi.advanceTimersByTime(2000)

      expect(game.score.value).toBe(initialScore + 1)
    })

    it('should move to next pokemon on correct guess', async () => {
      const game = useGame()
      game.startGame()

      const oldNext = game.nextPokemon.value

      const currentVal = game.currentPokemon.value!.weightkg
      const nextVal = game.nextPokemon.value!.weightkg

      if (nextVal >= currentVal) {
        game.makeGuess('higher')
      } else {
        game.makeGuess('lower')
      }

      // Wait for animations
      vi.advanceTimersByTime(2000)

      expect(game.currentPokemon.value).toBe(oldNext)
      expect(game.nextPokemon.value).not.toBe(oldNext)
    })

    it('should set phase to gameover on wrong guess', async () => {
      const game = useGame()
      game.startGame()

      const currentVal = game.currentPokemon.value!.weightkg
      const nextVal = game.nextPokemon.value!.weightkg

      // Make wrong guess
      if (nextVal >= currentVal) {
        game.makeGuess('lower')
      } else {
        game.makeGuess('higher')
      }

      expect(game.lastGuessCorrect.value).toBe(false)

      // Wait for game over delay
      vi.advanceTimersByTime(2500)

      expect(game.phase.value).toBe('gameover')
    })

    it('should update high score on game over if score is higher', async () => {
      const game = useGame()
      localStorageMock.setItem('pokemon-hl-highscore-weight', '5')
      game.score.value = 10
      game.startGame()

      const currentVal = game.currentPokemon.value!.weightkg
      const nextVal = game.nextPokemon.value!.weightkg

      // Make wrong guess
      if (nextVal >= currentVal) {
        game.makeGuess('lower')
      } else {
        game.makeGuess('higher')
      }

      vi.advanceTimersByTime(2500)

      expect(game.highScores.value.weight).toBeGreaterThanOrEqual(game.score.value)
    })
  })

  describe('goToMenu', () => {
    it('should reset phase to menu', () => {
      const game = useGame()
      game.startGame()
      game.goToMenu()
      expect(game.phase.value).toBe('menu')
    })

    it('should clear pokemon', () => {
      const game = useGame()
      game.startGame()
      game.goToMenu()
      expect(game.currentPokemon.value).toBeNull()
      expect(game.nextPokemon.value).toBeNull()
    })

    it('should reset lastGuessCorrect', () => {
      const game = useGame()
      game.startGame()
      game.lastGuessCorrect.value = true
      game.goToMenu()
      expect(game.lastGuessCorrect.value).toBeNull()
    })
  })

  describe('high score tracking', () => {
    it('should track separate high scores for weight and bst modes', () => {
      const game = useGame()
      expect(game.highScores.value.weight).toBe(0)
      expect(game.highScores.value.bst).toBe(0)
    })

    it('should return correct high score based on current mode', async () => {
      const game = useGame()
      game.highScores.value.weight = 10
      game.highScores.value.bst = 15

      await nextTick()

      game.guessMode.value = 'weight'
      expect(game.highScore.value).toBe(10)

      game.guessMode.value = 'bst'
      expect(game.highScore.value).toBe(15)
    })
  })

  describe('speciesList computed', () => {
    it('should update when configuration changes', () => {
      const game = useGame()
      const initialLength = game.speciesList.value.length

      game.fullyEvolvedOnly.value = true
      const fullyEvolvedLength = game.speciesList.value.length

      expect(fullyEvolvedLength).toBeLessThan(initialLength)
    })

    it('should filter by generation range', () => {
      const game = useGame()
      game.minGeneration.value = 1
      game.maxGeneration.value = 1

      const species = game.speciesList.value
      expect(species.every((s) => s.gen === 1)).toBe(true)
    })
  })
})
