import type { Meta, StoryObj } from '@storybook/vue3'
import PageHeader from './PageHeader.vue'

const meta: Meta<typeof PageHeader> = {
  title: 'Shared/PageHeader',
  component: PageHeader,
}

export default meta

type Story = StoryObj<typeof PageHeader>

export const Default: Story = {
  args: {
    title: 'My Page Title',
  },
}

export const LongTitle: Story = {
  args: {
    title: 'A Very Long Page Title That Tests Layout Behavior',
  },
}
