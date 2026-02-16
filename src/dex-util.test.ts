import { describe, it, expect } from 'vitest'
import { Dex, type Species } from '@pkmn/dex'
import {
  getFilteredSpecies,
  getGuessValue,
  getGuessUnit,
  getSpriteUrl,
  getTypeGradient,
  getRandomPokemon,
  getRandomPokemonExcluding,
  typeColors,
  type GameConfig,
} from '@/dex-util'

describe('dex-util', () => {
  describe('getFilteredSpecies', () => {
    it('should filter by generation range', () => {
      const config: GameConfig = {
        generation: 9,
        minGeneration: 1,
        maxGeneration: 1,
        fullyEvolvedOnly: false,
        guessMode: 'weight',
      }
      const species = getFilteredSpecies(config)
      expect(species.length).toBeGreaterThan(0)
      expect(species.every((s) => s.gen === 1)).toBe(true)
    })

    it('should filter out formes', () => {
      const config: GameConfig = {
        generation: 9,
        minGeneration: 1,
        maxGeneration: 9,
        fullyEvolvedOnly: false,
        guessMode: 'weight',
      }
      const species = getFilteredSpecies(config)
      expect(species.every((s) => !s.forme)).toBe(true)
    })

    it('should filter fully evolved only when enabled', () => {
      const config: GameConfig = {
        generation: 9,
        minGeneration: 1,
        maxGeneration: 1,
        fullyEvolvedOnly: true,
        guessMode: 'weight',
      }
      const species = getFilteredSpecies(config)
      expect(species.every((s) => !s.evos || s.evos.length === 0)).toBe(true)
    })

    it('should filter out zero weight pokemon in weight mode', () => {
      const config: GameConfig = {
        generation: 9,
        minGeneration: 1,
        maxGeneration: 9,
        fullyEvolvedOnly: false,
        guessMode: 'weight',
      }
      const species = getFilteredSpecies(config)
      expect(species.every((s) => s.weightkg > 0)).toBe(true)
    })

    it('should return all generations when min=1 and max=9', () => {
      const config: GameConfig = {
        generation: 9,
        minGeneration: 1,
        maxGeneration: 9,
        fullyEvolvedOnly: false,
        guessMode: 'bst',
      }
      const species = getFilteredSpecies(config)
      expect(species.length).toBeGreaterThan(100)
    })
  })

  describe('getGuessValue', () => {
    it('should return weight in weight mode', () => {
      const dex = Dex.forGen(9)
      const pikachu = dex.species.get('Pikachu')
      expect(getGuessValue(pikachu, 'weight')).toBe(pikachu.weightkg)
    })

    it('should return BST in bst mode', () => {
      const dex = Dex.forGen(9)
      const pikachu = dex.species.get('Pikachu')
      const bst =
        pikachu.baseStats.hp +
        pikachu.baseStats.atk +
        pikachu.baseStats.def +
        pikachu.baseStats.spa +
        pikachu.baseStats.spd +
        pikachu.baseStats.spe
      expect(getGuessValue(pikachu, 'bst')).toBe(bst)
    })
  })

  describe('getGuessUnit', () => {
    it('should return "kg" for weight mode', () => {
      expect(getGuessUnit('weight')).toBe('kg')
    })

    it('should return "m" for height mode', () => {
      expect(getGuessUnit('height')).toBe('m')
    })

    it('should return empty string for bst mode', () => {
      expect(getGuessUnit('bst')).toBe('')
    })
  })

  describe('getSpriteUrl', () => {
    it('should return correct PokeAPI sprite URL', () => {
      const dex = Dex.forGen(9)
      const pikachu = dex.species.get('Pikachu')
      const url = getSpriteUrl(pikachu)
      expect(url).toBe(
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pikachu.num}.png`,
      )
    })
  })

  describe('getTypeGradient', () => {
    it('should return gradient for single type', () => {
      const gradient = getTypeGradient(['Fire'])
      expect(gradient).toContain(typeColors.Fire)
      expect(gradient).toContain('linear-gradient')
    })

    it('should return gradient for dual type', () => {
      const gradient = getTypeGradient(['Fire', 'Flying'])
      expect(gradient).toContain(typeColors.Fire)
      expect(gradient).toContain(typeColors.Flying)
      expect(gradient).toContain('linear-gradient')
    })

    it('should handle unknown types with fallback color', () => {
      const gradient = getTypeGradient(['Unknown' as any])
      expect(gradient).toContain('#666')
    })

    it('should use same color for single type (both gradient stops)', () => {
      const gradient = getTypeGradient(['Water'])
      const waterColor = typeColors.Water
      expect(gradient.split(waterColor).length - 1).toBeGreaterThanOrEqual(2)
    })
  })

  describe('getRandomPokemon', () => {
    it('should return a pokemon from the list', () => {
      const dex = Dex.forGen(9)
      const species = dex.species.all().filter((s) => s.num > 0).slice(0, 10)
      const random = getRandomPokemon(species)
      expect(species).toContain(random)
    })

    it('should return different pokemon on multiple calls', () => {
      const dex = Dex.forGen(9)
      const species = dex.species.all().filter((s) => s.num > 0).slice(0, 50)
      const results = new Set()
      for (let i = 0; i < 20; i++) {
        results.add(getRandomPokemon(species).num)
      }
      // With 50 species and 20 tries, we should get at least a few different ones
      expect(results.size).toBeGreaterThan(1)
    })
  })

  describe('getRandomPokemonExcluding', () => {
    it('should not return the excluded pokemon', () => {
      const dex = Dex.forGen(9)
      const species = dex.species.all().filter((s) => s.num > 0).slice(0, 20)
      const excludeNum = species[0].num
      const random = getRandomPokemonExcluding(species, excludeNum)
      expect(random.num).not.toBe(excludeNum)
    })

    it('should return a pokemon from remaining list', () => {
      const dex = Dex.forGen(9)
      const species = dex.species.all().filter((s) => s.num > 0).slice(0, 10)
      const excludeNum = species[0].num
      const random = getRandomPokemonExcluding(species, excludeNum)
      expect(species.map((s) => s.num)).toContain(random.num)
    })
  })
})
