import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import PageHeader from './PageHeader.vue'

describe('PageHeader', () => {
  it('renderiza o título', () => {
    const wrapper = mount(PageHeader, { props: { title: 'Dashboard' } })
    expect(wrapper.find('h1').text()).toBe('Dashboard')
  })

  it('aplica as classes de tipografia ao título', () => {
    const wrapper = mount(PageHeader, { props: { title: 'Dashboard' } })
    expect(wrapper.find('h1').classes()).toContain('font-bold')
    expect(wrapper.find('h1').classes()).toContain('text-gray-900')
  })

  it('exibe o accent roxo', () => {
    const wrapper = mount(PageHeader, { props: { title: 'Dashboard' } })
    const accent = wrapper.find('[aria-hidden="true"]')
    expect(accent.exists()).toBe(true)
    expect(accent.classes()).toContain('bg-gradient-to-b')
    expect(accent.classes()).toContain('from-purple-400')
    expect(accent.classes()).toContain('to-purple-700')
  })

  it('renderiza a description quando fornecida', () => {
    const wrapper = mount(PageHeader, {
      props: { title: 'Dashboard', description: 'Visão geral do sistema' },
    })
    const desc = wrapper.find('p')
    expect(desc.exists()).toBe(true)
    expect(desc.text()).toBe('Visão geral do sistema')
  })

  it('não renderiza o parágrafo de description quando omitida', () => {
    const wrapper = mount(PageHeader, { props: { title: 'Dashboard' } })
    expect(wrapper.find('p').exists()).toBe(false)
  })
})
