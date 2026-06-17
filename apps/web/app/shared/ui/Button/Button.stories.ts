import type { Meta, StoryObj } from '@storybook/vue3'

import Button from './Button.vue'

const meta: Meta<typeof Button> = {
  title: 'Shared/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}

export default meta

type Story = StoryObj<typeof Button>

const render = (args: Story['args']) => ({
  components: { Button },
  setup() {
    return { args }
  },
  template: '<Button v-bind="args">Click me</Button>',
})

export const Primary: Story = { render, args: { variant: 'primary', size: 'md' } }
export const Secondary: Story = { render, args: { variant: 'secondary', size: 'md' } }
export const Ghost: Story = { render, args: { variant: 'ghost', size: 'md' } }
export const Small: Story = { render, args: { variant: 'primary', size: 'sm' } }
export const Large: Story = { render, args: { variant: 'primary', size: 'lg' } }
export const Disabled: Story = { render, args: { variant: 'primary', size: 'md', disabled: true } }
