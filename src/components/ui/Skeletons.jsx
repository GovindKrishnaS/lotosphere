// Skeleton for product cards
export function ProductCardSkeleton() {
  return (
    <div className="group">
      <div className="rounded-2xl mb-4 aspect-[3/4] skeleton" />
      <div className="px-1 space-y-2">
        <div className="skeleton h-3 w-16 rounded-full" />
        <div className="skeleton h-5 w-3/4 rounded-lg" />
        <div className="skeleton h-4 w-1/3 rounded-lg" />
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="container section-padding">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="aspect-square rounded-3xl skeleton" />
        <div className="space-y-4">
          <div className="skeleton h-4 w-24 rounded-full" />
          <div className="skeleton h-10 w-3/4 rounded-lg" />
          <div className="skeleton h-8 w-32 rounded-lg" />
          <div className="skeleton h-24 w-full rounded-xl" />
          <div className="skeleton h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function OrderRowSkeleton() {
  return (
    <div className="py-4 border-b border-border flex items-center gap-4">
      <div className="skeleton h-5 w-24 rounded" />
      <div className="skeleton h-5 w-32 rounded flex-1" />
      <div className="skeleton h-5 w-20 rounded" />
      <div className="skeleton h-6 w-16 rounded-full" />
    </div>
  )
}

export function Spinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }
  return (
    <div
      className={`inline-block animate-spin rounded-full border-forest border-t-transparent ${sizeClasses[size] || sizeClasses.md}`}
      role="status"
      aria-label="loading"
    />
  )
}
