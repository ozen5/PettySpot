// Public contact number (shown with the owner's consent). Keep all three forms in sync.
export const contactPhoneDisplay = '+7 707 396 3370'
export const contactPhoneTel = 'tel:+77073963370'
export const whatsappNumber = '77073963370'

export function buildWhatsAppUrl(text: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`
}
