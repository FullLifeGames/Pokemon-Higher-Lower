import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    game: {
      title: 'Pokémon Higher or Lower',
      subtitle: 'Can you guess which Pokémon has the higher value?',
      start: 'Start Game',
      playAgain: 'Play Again',
      backToMenu: 'Back to Menu',
      gameOver: 'Game Over!',
      score: 'Score',
      highScore: 'Best',
      correct: 'Correct!',
      wrong: 'Wrong!',
      vs: 'VS',
    },
    mode: {
      select: 'What do you want to compare?',
      weight: 'Weight',
      bst: 'Base Stats',
    },
    guess: {
      higher: 'Higher',
      lower: 'Lower',
      has: 'has',
      or: 'or',
      than: 'than',
    },
    settings: {
      genRange: 'Generation Range',
      fullyEvolved: 'Fully evolved only',
      minGen: 'From',
      maxGen: 'To',
    },
    sidebar: {
      madeBy: 'Made by',
      basedOn: 'Based on',
    },
    units: {
      kg: 'kg',
      m: 'm',
    },
  },
  de: {
    game: {
      title: 'Pokémon Höher oder Tiefer',
      subtitle: 'Kannst du erraten, welches Pokémon den höheren Wert hat?',
      start: 'Spiel starten',
      playAgain: 'Nochmal spielen',
      backToMenu: 'Zurück zum Menü',
      gameOver: 'Spiel vorbei!',
      score: 'Punkte',
      highScore: 'Rekord',
      correct: 'Richtig!',
      wrong: 'Falsch!',
      vs: 'VS',
    },
    mode: {
      select: 'Was möchtest du vergleichen?',
      weight: 'Gewicht',
      bst: 'Statuswerte',
    },
    guess: {
      higher: 'Höher',
      lower: 'Tiefer',
      has: 'hat',
      or: 'oder',
      than: 'als',
    },
    settings: {
      genRange: 'Generationsbereich',
      fullyEvolved: 'Nur voll entwickelt',
      minGen: 'Von',
      maxGen: 'Bis',
    },
    sidebar: {
      madeBy: 'Erstellt von',
      basedOn: 'Basierend auf',
    },
    units: {
      kg: 'kg',
      m: 'm',
    },
  },
}

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
})
