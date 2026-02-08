import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Dex } from '@pkmn/dex'
import GameBoard from '@/components/GameBoard.vue'
import { i18n } from '@/i18n'

describe('GameBoard', () => {
  const dex = Dex.forGen(9)
  const pikachu = dex.species.get('Pikachu')
  const charizard = dex.species.get('Charizard')

  const defaultProps = {
    phase: 'playing' as const,
    score: 0,
    highScore: 0,
    guessMode: 'weight' as const,
    currentPokemon: pikachu,
    nextPokemon: charizard,
    lastGuessCorrect: null as boolean | null,
    isTransitioning: false,
  }

  it('should render both pokemon names', () => {
    const wrapper = mount(GameBoard, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.text()).toContain('Pikachu')
    expect(wrapper.text()).toContain('Charizard')
  })

  it('should display current score and high score', () => {
    const wrapper = mount(GameBoard, {
      props: {
        ...defaultProps,
        score: 5,
        highScore: 10,
      },
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.text()).toContain('5')
    expect(wrapper.text()).toContain('10')
  })

  it('should show current pokemon value', () => {
    const wrapper = mount(GameBoard, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.text()).toContain(pikachu.weightkg.toString())
  })

  it('should show guess buttons in playing phase', () => {
    const wrapper = mount(GameBoard, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.text()).toContain('Higher')
    expect(wrapper.text()).toContain('Lower')
  })

  it('should emit guess event when higher button clicked', async () => {
    const wrapper = mount(GameBoard, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    const higherButton = wrapper.findAll('button').find((btn) => btn.text().includes('Higher'))
    await higherButton?.trigger('click')

    expect(wrapper.emitted('guess')).toBeTruthy()
    expect(wrapper.emitted('guess')?.[0]).toEqual(['higher'])
  })

  it('should emit guess event when lower button clicked', async () => {
    const wrapper = mount(GameBoard, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    const lowerButton = wrapper.findAll('button').find((btn) => btn.text().includes('Lower'))
    await lowerButton?.trigger('click')

    expect(wrapper.emitted('guess')).toBeTruthy()
    expect(wrapper.emitted('guess')?.[0]).toEqual(['lower'])
  })

  it('should show revealed value in revealing phase', async () => {
    const wrapper = mount(GameBoard, {
      props: {
        ...defaultProps,
        phase: 'revealing' as const,
        lastGuessCorrect: true,
      },
      global: {
        plugins: [i18n],
      },
    })

    // Should show "Correct!" text
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Correct')
  })

  it('should show wrong message when guess is incorrect', async () => {
    const wrapper = mount(GameBoard, {
      props: {
        ...defaultProps,
        phase: 'revealing' as const,
        lastGuessCorrect: false,
      },
      global: {
        plugins: [i18n],
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Wrong')
  })

  it('should display VS indicator', () => {
    const wrapper = mount(GameBoard, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.text()).toContain('VS')
  })

  it('should show checkmark when guess is correct', () => {
    const wrapper = mount(GameBoard, {
      props: {
        ...defaultProps,
        lastGuessCorrect: true,
      },
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.text()).toContain('✓')
  })

  it('should show X when guess is incorrect', () => {
    const wrapper = mount(GameBoard, {
      props: {
        ...defaultProps,
        lastGuessCorrect: false,
      },
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.text()).toContain('✗')
  })

  it('should render pokemon sprites with correct URLs', () => {
    const wrapper = mount(GameBoard, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    const images = wrapper.findAll('img')
    expect(images.length).toBe(2)
    expect(images[0]!.attributes('src')).toContain(pikachu.num.toString())
    expect(images[1]!.attributes('src')).toContain(charizard.num.toString())
  })

  it('should show unit for weight mode', () => {
    const wrapper = mount(GameBoard, {
      props: {
        ...defaultProps,
        guessMode: 'weight',
      },
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.text()).toContain('kg')
  })

  it('should not show unit for bst mode', () => {
    const wrapper = mount(GameBoard, {
      props: {
        ...defaultProps,
        guessMode: 'bst',
      },
      global: {
        plugins: [i18n],
      },
    })

    // kg should not appear in BST mode
    const text = wrapper.text()
    const kgMatches = text.match(/\bkg\b/g)
    expect(kgMatches).toBeNull()
  })

  it('should apply transitioning opacity', () => {
    const wrapper = mount(GameBoard, {
      props: {
        ...defaultProps,
        isTransitioning: true,
      },
      global: {
        plugins: [i18n],
      },
    })

    const mainDiv = wrapper.find('div')
    expect(mainDiv.classes()).toContain('opacity-0')
  })

  it('should hide guess buttons in revealing phase', () => {
    const wrapper = mount(GameBoard, {
      props: {
        ...defaultProps,
        phase: 'revealing' as const,
      },
      global: {
        plugins: [i18n],
      },
    })

    // Buttons should not be visible
    const buttons = wrapper.findAll('button')
    const hasGuessButtons = buttons.some(
      (btn) => btn.text().includes('Higher') || btn.text().includes('Lower'),
    )
    expect(hasGuessButtons).toBe(false)
  })

  it('should display localized pokemon names in German', async () => {
    const wrapper = mount(GameBoard, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    // Switch to German
    i18n.global.locale.value = 'de'
    await wrapper.vm.$nextTick()

    // Note: Pikachu's German name is also "Pikachu" but Charizard is "Glurak"
    // This test checks that the localization function is being called
    expect(wrapper.text()).toContain('Glurak')
  })
})
