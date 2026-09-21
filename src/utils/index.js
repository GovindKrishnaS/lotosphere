export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export function truncate(text, length = 100) {
  if (!text) return ''
  return text.length > length ? text.slice(0, length) + '…' : text
}

export function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString))
}

export function formatOrderId(uuid) {
  return '#' + uuid.slice(0, 8).toUpperCase()
}

export function getStatusColor(status) {
  const map = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return map[status] || 'bg-gray-100 text-gray-800'
}

export function getStatusLabel(status) {
  const map = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  }
  return map[status] || status
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || ''

export function getWhatsAppUrl(customText = 'Hello Lotosphere! I recently submitted a review and would like to claim my special offer.') {
  if (!WHATSAPP_NUMBER) return null
  const cleaned = WHATSAPP_NUMBER.replace(/[^0-9]/g, '')
  if (!cleaned) return null
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(customText)}`
}

