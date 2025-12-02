import { isEmpty } from './isEmpty'

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = 'en-US',
}: ConvertToLocaleParams): string => {
  if (!currency_code || isEmpty(currency_code)) return amount.toString()

  const cc = currency_code.toUpperCase()

  // Intl ile normal formatı al
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: cc,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount)

  // TRY için "TRY" veya "TL" görünümünü ₺ ile değiştir
  if (cc === 'TRY') {
    // 1) TRY veya TL metinlerini ₺ ile değiştir
    let out = formatted.replace(/\b(?:TRY|TL)\b/gi, '').trim() + ' TL'

    // 2) ₺ etrafındaki boşlukları temizle
    out = out.replace(/\s*₺\s*/g, '₺')

    // 3) Her durumda sembolü başa taşı (istenen görünüm: "₺1.234,56")
    if (!out.startsWith('₺')) {
      out = out.replace(/₺/g, '').trim()
    }

    return out
  }

  // Diğer para birimleri için normal Intl çıktısı
  return formatted
}
