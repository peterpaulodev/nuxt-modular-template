import type { Meta, StoryObj } from '@storybook/vue3'

import PageHeader from './PageHeader.vue'

const meta: Meta<typeof PageHeader> = {
  title: 'Shared/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
  },
}

export default meta

type Story = StoryObj<typeof PageHeader>

export const Default: Story = {
  args: {
    title: 'Dashboard',
  },
}

export const WithDescription: Story = {
  args: {
    title: 'Dashboard',
    description: 'Visão geral das métricas do sistema',
  },
}

export const LongTitle: Story = {
  args: {
    title: 'A Very Long Page Title That Tests Layout Behavior',
    description: 'Subtitle that accompanies a long title to check alignment',
  },
}
