import { ApiError } from '@core/api'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useDashboard } from '../composables/useDashboard'

// ofetch e useRuntimeConfig são dependências Nuxt — não estão disponíveis no vitest.
// Mockar o http-client impede que sejam carregadas transitivamente via @core/api.
vi.mock('@core/api/http-client', () => ({
  createHttpClient: vi.fn(),
}))

// vi.hoisted garante que mockGetMetrics esteja disponível antes do vi.mock ser processado
const mockGetMetrics = vi.hoisted(() => vi.fn())

vi.mock('../api/dashboard.repository', () => ({
  DashboardRepository: vi.fn().mockImplementation(function () {
    return { getMetrics: mockGetMetrics }
  }),
}))

describe('useDashboard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('isLoading fica true durante o fetch e false ao finalizar', async () => {
    mockGetMetrics.mockResolvedValue({ users: 10, transactions: 100 })
    const { isLoading, loadMetrics } = useDashboard()

    expect(isLoading.value).toBe(false)
    const promise = loadMetrics()
    expect(isLoading.value).toBe(true)
    await promise
    expect(isLoading.value).toBe(false)
  })

  it('popula metrics com o retorno do repository em caso de sucesso', async () => {
    mockGetMetrics.mockResolvedValue({ users: 10, transactions: 100 })
    const { metrics, loadMetrics } = useDashboard()

    await loadMetrics()

    expect(metrics.value).toEqual({ users: 10, transactions: 100 })
  })

  it('seta error tipado quando o repository lança ApiError', async () => {
    mockGetMetrics.mockRejectedValue(new ApiError('Not Found', 404))
    const { error, loadMetrics } = useDashboard()

    await loadMetrics()

    expect(error.value).toContain('404')
    expect(error.value).toContain('Not Found')
  })

  it('seta mensagem genérica para erros não tipados', async () => {
    mockGetMetrics.mockRejectedValue(new Error('Network failure'))
    const { error, loadMetrics } = useDashboard()

    await loadMetrics()

    expect(error.value).toBe('Erro inesperado. Tente novamente.')
  })
})
