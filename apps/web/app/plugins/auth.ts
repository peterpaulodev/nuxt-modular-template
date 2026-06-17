import { authService } from '@core/auth/auth.service'

// Plugin de inicialização da autenticação.
// Sem sufixo = executa no servidor e no cliente (universal) — necessário para
// hidratar o estado de auth no SSR e evitar flash de conteúdo não autenticado.
export default defineNuxtPlugin(async () => {
  // Aqui você inicializaria o provedor de autenticação escolhido, por exemplo:
  // await authService.initialize()          — carregar sessão do cookie/localStorage
  // authService.scheduleTokenRefresh()      — renovar token antes de expirar
  // nuxtApp.provide('auth', authService)    — injetar no contexto se preferir

  // Provedores comuns: Keycloak, Auth0, Okta, NextAuth (via API), Firebase Auth
  void authService
})
