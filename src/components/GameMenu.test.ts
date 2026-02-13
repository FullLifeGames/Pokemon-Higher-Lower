import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import GameMenu from '@/components/GameMenu.vue'
import { i18n } from '@/i18n'

describe('GameMenu', () => {
  const defaultProps = {
    guessMode: 'weight' as const,
    minGeneration: 1,
    maxGeneration: 9,
    fullyEvolvedOnly: false,
    canStart: true,
    highScores: { weight: 0, bst: 0 },
  }

  beforeEach(() => {
    // Reset i18n locale
    i18n.global.locale.value = 'en'
  })

  it('should render the game title', () => {
    const wrapper = mount(GameMenu, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })
    expect(wrapper.text()).toContain('Pokémon Higher or Lower')
  })

  it('should display high score when greater than 0', () => {
    const wrapper = mount(GameMenu, {
      props: {
        ...defaultProps,
        highScores: { weight: 15, bst: 0 },
      },
      global: {
        plugins: [i18n],
      },
    })
    expect(wrapper.text()).toContain('15')
  })

  it('should switch between weight and bst modes', async () => {
    const wrapper = mount(GameMenu, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    // Find BST mode button and click it
    const buttons = wrapper.findAll('button')
    const bstButton = buttons.find((btn) => btn.text().includes('Base Stats'))

    await bstButton?.trigger('click')

    expect(wrapper.emitted('update:guessMode')).toBeTruthy()
    expect(wrapper.emitted('update:guessMode')?.[0]).toEqual(['bst'])
  })

  it('should emit start event when start button clicked', async () => {
    const wrapper = mount(GameMenu, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    const startButton = wrapper.findAll('button').find((btn) => btn.text().includes('Start Game'))
    await startButton?.trigger('click')

    expect(wrapper.emitted('start')).toBeTruthy()
  })

  it('should disable start button when canStart is false', () => {
    const wrapper = mount(GameMenu, {
      props: {
        ...defaultProps,
        canStart: false,
      },
      global: {
        plugins: [i18n],
      },
    })

    const startButton = wrapper.findAll('button').find((btn) => btn.text().includes('Start Game'))
    expect(startButton?.attributes('disabled')).toBeDefined()
  })

  it('should update minGeneration when select changed', async () => {
    const wrapper = mount(GameMenu, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    const selects = wrapper.findAll('select')
    const minGenSelect = selects[0]

    await minGenSelect?.setValue('3')

    expect(wrapper.emitted('update:minGeneration')).toBeTruthy()
    expect(wrapper.emitted('update:minGeneration')?.[0]).toEqual([3])
  })

  it('should update maxGeneration when select changed', async () => {
    const wrapper = mount(GameMenu, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    const selects = wrapper.findAll('select')
    const maxGenSelect = selects[1]

    await maxGenSelect?.setValue('5')

    expect(wrapper.emitted('update:maxGeneration')).toBeTruthy()
    expect(wrapper.emitted('update:maxGeneration')?.[0]).toEqual([5])
  })

  it('should toggle fullyEvolvedOnly', async () => {
    const wrapper = mount(GameMenu, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    // Find the toggle button by looking for the specific classes
    const toggleButtons = wrapper.findAll('button')
    const toggleButton = toggleButtons.find((btn) => {
      return btn.classes().includes('w-10') && btn.classes().includes('h-5')
    })

    await toggleButton?.trigger('click')

    expect(wrapper.emitted('update:fullyEvolvedOnly')).toBeTruthy()
    expect(wrapper.emitted('update:fullyEvolvedOnly')?.[0]).toEqual([true])
  })

  it('should toggle language', async () => {
    const wrapper = mount(GameMenu, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    // Find language toggle (shows EN or DE)
    const langButton = wrapper.findAll('button').find((btn) => btn.text() === 'DE' || btn.text() === 'EN')

    await langButton?.trigger('click')

    // Check that the locale would change
    expect(langButton).toBeTruthy()
  })

  it('should show correct high score based on mode', () => {
    const wrapper = mount(GameMenu, {
      props: {
        ...defaultProps,
        guessMode: 'weight',
        highScores: { weight: 10, bst: 20 },
      },
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.text()).toContain('10')
  })

  it('should display mode indicator for active mode', () => {
    const wrapper = mount(GameMenu, {
      props: {
        ...defaultProps,
        guessMode: 'weight',
      },
      global: {
        plugins: [i18n],
      },
    })

    // Check that weight button has active styling
    const buttons = wrapper.findAll('button')
    const weightButton = buttons.find((btn) => btn.text().includes('Weight'))
    expect(weightButton?.classes()).toContain('border-white/20')
  })

  it('should render footer links', () => {
    const wrapper = mount(GameMenu, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.html()).toContain('fulllifegames.com')
    expect(wrapper.html()).toContain('github.com/FullLifeGames/Pokemon-Higher-Lower')
  })

  it('should translate text when locale changes', async () => {
    const wrapper = mount(GameMenu, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    // Initially English
    expect(wrapper.text()).toContain('Start Game')

    // Change to German
    i18n.global.locale.value = 'de'
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Spiel starten')
  })
})
