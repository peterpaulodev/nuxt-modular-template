import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Button from './Button.vue'

describe('Button', () => {
  it('renderiza o conteúdo do slot', () => {
    const wrapper = mount(Button, { slots: { default: 'Clique aqui' } })
    expect(wrapper.text()).toBe('Clique aqui')
  })

  it('aplica as classes da variante primary por padrão', () => {
    const wrapper = mount(Button)
    expect(wrapper.classes()).toContain('bg-purple-600')
  })

  it('aplica as classes da variante secondary', () => {
    const wrapper = mount(Button, { props: { variant: 'secondary' } })
    expect(wrapper.classes()).toContain('border-purple-600')
    expect(wrapper.classes()).not.toContain('bg-purple-600')
  })

  it('aplica as classes da variante ghost', () => {
    const wrapper = mount(Button, { props: { variant: 'ghost' } })
    expect(wrapper.classes()).toContain('text-purple-600')
    expect(wrapper.classes()).not.toContain('bg-purple-600')
  })

  it('seta o atributo disabled quando a prop disabled é true', () => {
    const wrapper = mount(Button, { props: { disabled: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})
