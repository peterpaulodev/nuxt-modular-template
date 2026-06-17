import type { Meta, StoryObj } from '@storybook/vue3'

import MetricCard from './MetricCard.vue'

const meta: Meta<typeof MetricCard> = {
  title: 'Shared/MetricCard',
  component: MetricCard,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
  },
}

export default meta

type Story = StoryObj<typeof MetricCard>

export const Default: Story = {
  args: {
    label: 'Usuários',
    value: '1.234',
  },
}

export const LargeNumber: Story = {
  args: {
    label: 'Transações',
    value: '98.765',
  },
}

export const ZeroValue: Story = {
  args: {
    label: 'Erros',
    value: '0',
  },
}
