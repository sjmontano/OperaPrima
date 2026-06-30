'use client'

interface EmptyPlaceholderProps {
  icon?: 'artist' | 'event' | 'project' | 'community'
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

const ICONS: Record<string, React.ReactElement> = {
  artist: (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-32 w-32">
      <circle cx="100" cy="80" r="40" stroke="#8ECAE6" strokeWidth="3" fill="none" />
      <path
        d="M60 170 Q80 130 100 130 Q120 130 140 170"
        stroke="#023047"
        strokeWidth="3"
        fill="none"
      />
      <rect x="75" y="90" width="50" height="8" rx="4" fill="#8ECAE6" />
      <circle cx="86" cy="72" r="4" fill="#E63946" />
      <circle cx="114" cy="72" r="4" fill="#E63946" />
      <path
        d="M90 100 Q100 108 110 100"
        stroke="#023047"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  ),
  event: (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-32 w-32">
      <rect
        x="40"
        y="45"
        width="120"
        height="120"
        rx="12"
        stroke="#4682B4"
        strokeWidth="3"
        fill="none"
      />
      <rect x="55" y="80" width="90" height="2" fill="#8ECAE6" />
      <rect x="55" y="100" width="60" height="2" fill="#8ECAE6" />
      <rect x="55" y="120" width="45" height="2" fill="#8ECAE6" />
      <rect x="70" y="25" width="4" height="20" rx="2" fill="#E63946" />
      <rect x="126" y="25" width="4" height="20" rx="2" fill="#E63946" />
      <circle
        cx="100"
        cy="100"
        r="30"
        stroke="#E63946"
        strokeWidth="2"
        strokeDasharray="4 4"
        fill="none"
      />
    </svg>
  ),
  project: (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-32 w-32">
      <rect
        x="45"
        y="50"
        width="110"
        height="130"
        rx="6"
        stroke="#023047"
        strokeWidth="3"
        fill="none"
      />
      <rect x="60" y="40" width="80" height="20" rx="4" fill="#8ECAE6" />
      <rect x="60" y="80" width="80" height="4" rx="2" fill="#E4E4E7" />
      <rect x="60" y="96" width="60" height="4" rx="2" fill="#E4E4E7" />
      <rect x="60" y="112" width="70" height="4" rx="2" fill="#E4E4E7" />
      <rect x="60" y="140" width="40" height="4" rx="2" fill="#4682B4" />
      <circle cx="155" cy="160" r="18" fill="#8ECAE6" opacity="0.4" />
    </svg>
  ),
  community: (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-32 w-32">
      <circle cx="80" cy="70" r="22" stroke="#8ECAE6" strokeWidth="3" fill="none" />
      <circle cx="130" cy="70" r="22" stroke="#4682B4" strokeWidth="3" fill="none" />
      <path d="M55 150 Q80 110 105 150" stroke="#8ECAE6" strokeWidth="3" fill="none" />
      <path d="M100 150 Q130 110 155 150" stroke="#4682B4" strokeWidth="3" fill="none" />
      <circle cx="105" cy="150" r="4" fill="#E63946" />
      <line
        x1="102"
        y1="70"
        x2="108"
        y2="70"
        stroke="#023047"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="152"
        y1="70"
        x2="158"
        y2="70"
        stroke="#023047"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  ),
}

export function EmptyPlaceholder({
  icon = 'artist',
  title,
  description,
  action,
}: EmptyPlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
      {ICONS[icon] ?? ICONS.artist}
      <div className="max-w-xs">
        <p className="text-sm font-bold tracking-wider uppercase" style={{ color: '#353535' }}>
          {title}
        </p>
        {description && (
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'oklch(0.52 0.010 350)' }}>
            {description}
          </p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="border-2 border-[#023047] px-5 py-2 text-xs font-bold tracking-widest uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#023047] hover:text-white hover:shadow-[3px_3px_0_#353535] active:translate-x-0 active:translate-y-0 active:shadow-none"
          style={{ color: '#023047' }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
