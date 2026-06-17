import { authService } from '@core/auth/auth.service'

// Middleware de proteção de rotas.
// Aplique em qualquer página com: definePageMeta({ middleware: 'auth' })
//
// Para proteger todas as rotas globalmente, renomeie este arquivo para
// auth.global.ts — o Nuxt aplicará automaticamente sem precisar declarar nas páginas.
export default defineNuxtRouteMiddleware(() => {
  if (authService.isAuthenticated()) return

  // Quando auth estiver implementado, redirecione para a página de login:
  // return navigateTo('/login')
})
