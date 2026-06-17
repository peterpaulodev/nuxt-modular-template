// Utilitários de formatação genéricos.
// Não pertencem a nenhum módulo — qualquer domínio pode importar daqui.

/**
 * Formata um número usando a API nativa Intl.NumberFormat.
 * @example formatNumber(1000000) → "1.000.000"
 */
export const formatNumber = (value: number, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale).format(value)
}
