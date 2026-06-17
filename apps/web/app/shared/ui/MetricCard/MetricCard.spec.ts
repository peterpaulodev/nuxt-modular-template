import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import MetricCard from './MetricCard.vue'

describe('MetricCard', () => {
  it('renderiza o label', () => {
    const wrapper = mount(MetricCard, { props: { label: 'Usuários', value: '1.234' } })
    expect(wrapper.text()).toContain('Usuários')
  })

  it('renderiza o value', () => {
    const wrapper = mount(MetricCard, { props: { label: 'Usuários', value: '1.234' } })
    expect(wrapper.text()).toContain('1.234')
  })

  it('aplica o accent roxo na borda esquerda', () => {
    const wrapper = mount(MetricCard, { props: { label: 'Usuários', value: '1.234' } })
    expect(wrapper.classes()).toContain('border-l-purple-600')
  })

  it('aplica a cor roxa no valor', () => {
    const wrapper = mount(MetricCard, { props: { label: 'Usuários', value: 42 } })
    const valueEl = wrapper.find('p.text-purple-700')
    expect(valueEl.exists()).toBe(true)
    expect(valueEl.text()).toBe('42')
  })
})
