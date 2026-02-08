import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GameOver from '@/components/GameOver.vue'
import { i18n } from '@/i18n'

describe('GameOver', () => {
  const defaultProps = {
    score: 10,
    highScore: 15,
    guessMode: 'weight' as const,
  }

  it('should render game over title', () => {
    const wrapper = mount(GameOver, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.text()).toContain('Game Over')
  })

  it('should display the final score', () => {
    const wrapper = mount(GameOver, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.text()).toContain('10')
  })

  it('should display the high score', () => {
    const wrapper = mount(GameOver, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.text()).toContain('15')
  })

  it('should emit playAgain event when play again button clicked', async () => {
    const wrapper = mount(GameOver, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    const playAgainButton = wrapper.findAll('button').find((btn) => btn.text().includes('Play Again'))
    await playAgainButton?.trigger('click')

    expect(wrapper.emitted('playAgain')).toBeTruthy()
  })

  it('should emit backToMenu event when back to menu button clicked', async () => {
    const wrapper = mount(GameOver, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    const backButton = wrapper.findAll('button').find((btn) => btn.text().includes('Back to Menu'))
    await backButton?.trigger('click')

    expect(wrapper.emitted('backToMenu')).toBeTruthy()
  })

  it('should show mode name for weight mode', () => {
    const wrapper = mount(GameOver, {
      props: {
        ...defaultProps,
        guessMode: 'weight',
      },
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.text()).toContain('Weight')
  })

  it('should show mode name for bst mode', () => {
    const wrapper = mount(GameOver, {
      props: {
        ...defaultProps,
        guessMode: 'bst',
      },
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.text()).toContain('Base Stats')
  })

  it('should apply red color for weight mode score', () => {
    const wrapper = mount(GameOver, {
      props: {
        ...defaultProps,
        guessMode: 'weight',
      },
      global: {
        plugins: [i18n],
      },
    })

    const scoreElement = wrapper.find('.text-red-400')
    expect(scoreElement.exists()).toBe(true)
  })

  it('should apply blue color for bst mode score', () => {
    const wrapper = mount(GameOver, {
      props: {
        ...defaultProps,
        guessMode: 'bst',
      },
      global: {
        plugins: [i18n],
      },
    })

    const scoreElement = wrapper.find('.text-blue-400')
    expect(scoreElement.exists()).toBe(true)
  })

  it('should render with backdrop blur overlay', () => {
    const wrapper = mount(GameOver, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    const overlay = wrapper.find('div')
    expect(overlay.classes()).toContain('backdrop-blur-md')
  })

  it('should display emoji', () => {
    const wrapper = mount(GameOver, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.text()).toContain('😵')
  })

  it('should translate to German', async () => {
    const wrapper = mount(GameOver, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    i18n.global.locale.value = 'de'
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Spiel vorbei')
  })

  it('should have two buttons', () => {
    const wrapper = mount(GameOver, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(2)
  })

  it('should show score label', async () => {
    const wrapper = mount(GameOver, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    // Reset to English for consistent test
    i18n.global.locale.value = 'en'
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Score')
  })

  it('should show high score label', () => {
    const wrapper = mount(GameOver, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    // Reset to English for consistent test
    i18n.global.locale.value = 'en'
    expect(wrapper.text()).toContain('Best')
  })
})
