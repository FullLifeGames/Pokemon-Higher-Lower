import { Dex, type Species } from "@pkmn/dex";

const generation = ref(9);
const minGeneration = ref(1);
const maxGeneration = ref(9);
const fullyEvolvedOnly = ref(false);

const generationDex = computed(() => Dex.forGen(generation.value));
const species = computed(() => {
  let allSpecies = generationDex.value.species.all().filter(s => s.num > 0 && s.forme !== "Gmax" && s.forme !== "Alola-Totem");
  
  // Filter by generation range (min and max)
  allSpecies = allSpecies.filter(s => s.gen >= minGeneration.value && s.gen <= maxGeneration.value);
  
  // Filter by evolution stage
  if (fullyEvolvedOnly.value) {
    allSpecies = allSpecies.filter(s => !s.evos || s.evos.length === 0);
  }
  
  return allSpecies;
});

const generateRandomPokemon = () => {
  const randomIndex = Math.floor(Math.random() * species.value.length);
  return species.value[randomIndex]!;
};

const currentPokemon = ref(generateRandomPokemon());
const nextPokemon = ref(generateRandomPokemon());

const guessMode = ref<"weight" | "height">("weight");

const getGuessValue = (pokemon: Species) => {
    if (guessMode.value === "weight") {
        return pokemon.weightkg;
    } else {
        return pokemon.weighthg;
    }
};
