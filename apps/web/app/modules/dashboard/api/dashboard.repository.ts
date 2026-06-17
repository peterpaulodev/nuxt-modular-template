import { createHttpClient } from '@core/api/http-client'

import type { DashboardMetrics } from '../types'

// Interface que representa o formato bruto retornado pela API (DTO).
// Isolada aqui para que mudanças no contrato externo não vazem para o domínio.
interface UserDto {
  id: number
}

interface PostDto {
  id: number
}

// O Repository é a única camada que conhece a API.
// Ele busca dados, mapeia DTOs para tipos de domínio e expõe uma interface limpa para os composables.
export class DashboardRepository {
  async getMetrics(): Promise<DashboardMetrics> {
    const http = createHttpClient()

    // Chamadas paralelas para minimizar latência
    const [users, posts] = await Promise.all([
      http<UserDto[]>('/users'),
      http<PostDto[]>('/posts'),
    ])

    // Mapper: transforma os dados da API no tipo de domínio do módulo
    return {
      users: users.length,
      transactions: posts.length,
    }
  }
}

