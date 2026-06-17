import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useDashboardStore } from '../stores/dashboard.store'

describe('useDashboardStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('inicia com metrics null', () => {
    const store = useDashboardStore()
    expect(store.metrics).toBeNull()
  })

  it('atualiza metrics corretamente', () => {
    const store = useDashboardStore()
    store.metrics = { users: 5, transactions: 50 }
    expect(store.metrics).toEqual({ users: 5, transactions: 50 })
  })

  it('compartilha estado entre instâncias do store', () => {
    const store1 = useDashboardStore()
    const store2 = useDashboardStore()

    store1.metrics = { users: 3, transactions: 30 }

    expect(store2.metrics).toEqual({ users: 3, transactions: 30 })
  })
})
