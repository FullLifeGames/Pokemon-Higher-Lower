# Pokémon Higher or Lower

A Pokémon-themed guessing game inspired by [The Higher Lower Game](https://www.higherlowergame.com/). Compare Pokémon stats and guess which one has the higher value!

![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

## 🎮 How to Play

1. **Choose a mode** — compare Pokémon by **Weight** (kg) or **Base Stat Total** (BST)
2. **Set your filters** — pick a generation range and optionally restrict to fully evolved Pokémon
3. **Guess higher or lower** — a Pokémon with a known value is shown on the left; guess whether the next Pokémon on the right has a higher or lower value
4. **Keep your streak going** — each correct guess scores a point; one wrong guess and it's game over!

## ✨ Features

- **Two game modes**: Weight and Base Stat Total
- **Generation filtering**: Play with Pokémon from Gen 1–9
- **Fully evolved filter**: Optionally limit to final evolution forms
- **Bilingual**: Full English and German support (including localized Pokémon names)
- **Per-mode high scores**: Separate high scores for Weight and BST, persisted in local storage
- **Responsive design**: Works on desktop, mobile (portrait & landscape)
- **Animated reveals**: Smooth counting animation when revealing values
- **Type-based gradients**: Background colors match the Pokémon's type

## 🛠️ Tech Stack

- [Vue 3](https://vuejs.org/) — Composition API with `<script setup>`
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) (via [Rolldown](https://rolldown.rs/))
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn-vue](https://www.shadcn-vue.com/) — UI components
- [@pkmn/dex](https://github.com/pkmn/ps) — Pokémon data (species, stats, types)
- [vue-i18n](https://vue-i18n.intlify.dev/) — Internationalization
- [@vueuse/core](https://vueuse.org/) — Composable utilities

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/FullLifeGames/Pokemon-Higher-Lower.git
cd Pokemon-Higher-Lower

# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```

The app will be available at `http://localhost:5173`.

### Run Tests

```bash
# Run tests once
pnpm test --run

# Run tests in watch mode
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

### Build for Production

```bash
pnpm build
```

The output will be in the `dist/` directory, ready to deploy as a static site.

## 📁 Project Structure

```
src/
├── App.vue                    # Root component — orchestrates game phases
├── main.ts                    # App entry point
├── style.css                  # Tailwind config & global styles
├── dex-util.ts                # Pokémon data helpers (sprites, stats, types)
├── dex-util.test.ts          # Unit tests for utilities
├── i18n/
│   └── index.ts               # EN/DE translations
├── composables/
│   ├── useGame.ts             # Game state machine & logic
│   └── useGame.test.ts        # Unit tests for game logic
├── components/
│   ├── GameMenu.vue           # Start screen with settings
│   ├── GameMenu.test.ts       # Component tests
│   ├── GameBoard.vue          # Main gameplay split-screen view
│   ├── GameBoard.test.ts      # Component tests
│   ├── GameOver.vue           # Game over overlay
│   ├── GameOver.test.ts       # Component tests
│   └── ui/                    # shadcn-vue components
└── lib/
    ├── utils.ts               # Tailwind merge utility
    ├── pokemonNameHelper.ts   # Localized Pokémon name resolver
    └── pokemonNames.json      # English → German name mapping
```

## 🧪 Testing

The project includes comprehensive unit and component tests using Vitest and @vue/test-utils:

- **Unit tests** for utility functions (dex-util.ts) - filtering, calculations, randomization
- **Composable tests** for game logic (useGame.ts) - state machine, scoring, high scores
- **Component tests** for UI (GameMenu, GameBoard, GameOver) - rendering, events, translations

Test coverage includes:
- ✅ 18 tests for Pokémon data utilities
- ✅ 23 tests for game state management
- ✅ 45 tests for component behavior

Run `pnpm test:coverage` to see detailed coverage reports.

## 🌍 Localization

The game supports **English** and **German**. Toggle the language from the top-right corner of the menu screen. When German is selected, Pokémon names are also displayed in their official German translations.

## 🙏 Credits

- Game concept inspired by [The Higher Lower Game](https://www.higherlowergame.com/)
- Pokémon data provided by [@pkmn/dex](https://github.com/pkmn/ps)
- Pokémon sprites from [PokéAPI](https://pokeapi.co/)
- Built with [Vue 3](https://vuejs.org/) and [shadcn-vue](https://www.shadcn-vue.com/)
- Developed with assistance from [Claude](https://claude.ai/) by Anthropic

## 📄 License

This project is for educational and entertainment purposes. Pokémon is © Nintendo/Game Freak/The Pokémon Company.
