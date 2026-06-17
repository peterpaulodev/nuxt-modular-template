// Tipos compartilhados e agnósticos de domínio.
// Qualquer módulo com listagem paginada pode importar daqui.

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  perPage: number
}
