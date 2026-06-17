import { AppError } from './app-error'

export class BusinessError extends AppError {
  constructor(message: string) {
    super(message)
    this.name = 'BusinessError'
  }
}
