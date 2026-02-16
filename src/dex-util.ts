import { Dex, type Species } from '@pkmn/dex'
import { Dex as SimDex } from '@pkmn/sim'

export type GuessMode = 'weight' | 'height' | 'bst' | 'hp' | 'attack' | 'defense' | 'specialAttack' | 'specialDefense' | 'speed'

export interface GameConfig {
  generation: number
  minGeneration: number
  maxGeneration: number
  fullyEvolvedOnly: boolean
  guessMode: GuessMode
}

export const typeColors: Record<string, string> = {
  Normal: '#A8A77A',
  Fire: '#EE8130',
  Water: '#6390F0',
  Electric: '#F7D02C',
  Grass: '#7AC74C',
  Ice: '#96D9D6',
  Fighting: '#C22E28',
  Poison: '#A33EA1',
  Ground: '#E2BF65',
  Flying: '#A98FF3',
  Psychic: '#F95587',
  Bug: '#A6B91A',
  Rock: '#B6A136',
  Ghost: '#735797',
  Dragon: '#6F35FC',
  Dark: '#705746',
  Steel: '#B7B7CE',
  Fairy: '#D685AD',
}

function getBST(pokemon: Species): number {
  const s = pokemon.baseStats
  return s.hp + s.atk + s.def + s.spa + s.spd + s.spe
}

export function getFilteredSpecies(config: GameConfig): Species[] {
  const dex = Dex.forGen(config.generation)
  let allSpecies = dex.species
    .all()
    .filter((s) => s.num > 0 && !s.forme)

  allSpecies = allSpecies.filter(
    (s) => s.gen >= config.minGeneration && s.gen <= config.maxGeneration,
  )

  if (config.fullyEvolvedOnly) {
    allSpecies = allSpecies.filter((s) => !s.evos || s.evos.length === 0)
  }

  // Filter out Pokémon with zero weight (for weight mode)
  if (config.guessMode === 'weight') {
    allSpecies = allSpecies.filter((s) => s.weightkg > 0)
  }

  return allSpecies
}

export function getGuessValue(pokemon: Species, mode: GuessMode): number {
  switch (mode) {
    case 'weight':
      return pokemon.weightkg
    case 'height': {
      // Use @pkmn/sim to access heightm property
      const simSpecies = SimDex.species.get(pokemon.name)
      return simSpecies?.heightm ?? 0
    }
    case 'bst':
      return getBST(pokemon)
    case 'hp':
      return pokemon.baseStats.hp
    case 'attack':
      return pokemon.baseStats.atk
    case 'defense':
      return pokemon.baseStats.def
    case 'specialAttack':
      return pokemon.baseStats.spa
    case 'specialDefense':
      return pokemon.baseStats.spd
    case 'speed':
      return pokemon.baseStats.spe
  }
}

export function getGuessUnit(mode: GuessMode): string {
  switch (mode) {
    case 'weight':
      return 'kg'
    case 'height':
      return 'm'
    default:
      return ''
  }
}

export function getSpriteUrl(pokemon: Species): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.num}.png`
}

export function getTypeGradient(types: readonly string[]): string {
  const t0 = types[0]
  const t1 = types[1]
  const color1 = (t0 && typeColors[t0]) || '#666'
  const color2 = t1 ? (typeColors[t1] || color1) : color1
  return `linear-gradient(135deg, ${color1}dd 0%, ${color2}dd 100%)`
}

export function getRandomPokemon(speciesList: Species[]): Species {
  return speciesList[Math.floor(Math.random() * speciesList.length)]!
}

export function getRandomPokemonExcluding(speciesList: Species[], excludeNum: number): Species {
  const filtered = speciesList.filter((s) => s.num !== excludeNum)
  return filtered[Math.floor(Math.random() * filtered.length)]!
}
