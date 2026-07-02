export function SkeletonCard() {
  return (
    <div className="space-y-3">
      <div className="h-32 w-full animate-pulse rounded bg-zinc-200" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-200" />
    </div>
  )
}

export function SkeletonText({ lines = 4 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="h-3 animate-pulse rounded bg-zinc-200"
          style={{ width: `${55 + i * 10}%` }}
        />
      ))}
    </div>
  )
}

export function SkeletonHero() {
  return (
    <section className="w-full" style={{ background: '#353535' }}>
      <div className="h-[clamp(100px,18vw,200px)] w-full animate-pulse bg-zinc-700/50" />
      <div className="mx-auto max-w-[1024px] px-6 pt-4 pb-12 lg:pb-16">
        <div className="flex items-start justify-between gap-8 lg:gap-16">
          <div className="min-w-0 flex-1 space-y-4">
            <div className="h-3 w-28 animate-pulse rounded bg-zinc-600" />
            <div className="h-12 w-3/4 animate-pulse rounded bg-zinc-600" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-600" />
          </div>
          <div className="size-[clamp(100px,14vw,192px)] shrink-0 animate-pulse rounded-sm bg-zinc-600 pt-1" />
        </div>
      </div>
    </section>
  )
}

export function SkeletonBadge() {
  return <div className="inline-block h-6 w-20 animate-pulse rounded bg-zinc-200" />
}

export function LoadingButton() {
  return (
    <button
      type="button"
      disabled
      className="inline-flex cursor-not-allowed items-center gap-2 border-2 border-zinc-200 bg-zinc-100 px-6 py-3 text-xs font-bold tracking-widest text-zinc-400 uppercase"
    >
      <div className="size-3.5 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
      Cargando
    </button>
  )
}
