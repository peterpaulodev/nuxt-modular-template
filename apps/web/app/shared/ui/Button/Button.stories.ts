import type { Meta, StoryObj } from '@storybook/vue3'
import Button from './Button.vue'

const meta: Meta<typeof Button> = {
  title: 'Shared/Button',
  component: Button,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = {
  render: (args) => ({
    components: { Button },
    setup() { return { args } },
    template: '<Button v-bind="args">Example Content</Button>',
  }),
}
