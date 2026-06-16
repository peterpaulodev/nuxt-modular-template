import { AppError } from '../errors'

export class ApiError extends AppError {
  constructor(
    message: string,
    status?: number
  ) {
    super(message, 'API_ERROR', status)

    this.name = 'ApiError'
  }
}