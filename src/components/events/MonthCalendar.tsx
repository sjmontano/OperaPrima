'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'

interface CalendarEvent {
  id: string
  title: string
  date: string
  location: string
  eventDate: Date
}

export function MonthCalendar({ events }: { events: CalendarEvent[] }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const today = new Date()

  const firstDay = new Date(year, month, 1)

  const lastDay = new Date(year, month + 1, 0)

  const daysInMonth = lastDay.getDate()

  const startDay = firstDay.getDay()

  const calendar = []

  for (let i = 0; i < startDay; i++) {
    calendar.push(null)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendar.push(day)
  }

  const eventsByDay = useMemo(() => {
    const map: Record<number, CalendarEvent[]> = {}

    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    events.forEach((event) => {
      const eventDate = event.eventDate

      if (eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear) {
        const day = eventDate.getDate()

        if (!map[day]) {
          map[day] = []
        }

        map[day].push(event)
      }
    })

    return map
  }, [events, currentDate])

  function previousMonth() {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  return (
    <div className="p-8">
      {/* Header */}

      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={previousMonth}
          className="rounded-lg border border-zinc-200 p-2 transition hover:border-[#023047] hover:text-[#023047]"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold capitalize">
            {currentDate.toLocaleDateString('es-CO', {
              month: 'long',
              year: 'numeric',
            })}
          </h2>

          <p className="mt-1 text-sm text-zinc-500">{events.length} eventos registrados</p>
        </div>

        <button
          onClick={nextMonth}
          className="rounded-lg border border-zinc-200 p-2 transition hover:border-[#023047] hover:text-[#023047]"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Encabezados */}

      <div className="mb-3 grid grid-cols-7 gap-3">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
          <div key={day} className="text-center text-sm font-bold text-zinc-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendario */}

      <div className="grid grid-cols-7 gap-3">
        {calendar.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="h-36" />
          }

          const dayEvents = eventsByDay[day] || []

          const isToday =
            day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

          return (
            <div
              key={`day-${day}`}
              className={`h-36 rounded-xl border p-3 transition-all duration-200 hover:-translate-y-1 hover:border-[#023047] hover:shadow-md ${
                isToday ? 'border-[#E63946] shadow-[3px_3px_0_#E63946]' : 'border-zinc-200'
              } `}
            >
              {/* Número */}

              <div className="mb-3 flex items-center justify-between">
                <span
                  className={`text-sm font-bold ${isToday ? 'text-[#E63946]' : 'text-zinc-800'} `}
                >
                  {day}
                </span>

                {dayEvents.length > 0 && (
                  <div className="flex gap-1">
                    {dayEvents.slice(0, 3).map((_, i) => (
                      <div key={i} className="h-2 w-2 rounded-full bg-[#E63946]" />
                    ))}
                  </div>
                )}
              </div>

              {/* Eventos */}

              <div className="max-h-20 space-y-1 overflow-y-auto">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className="truncate rounded-md bg-[#E63946] px-2 py-1 text-xs text-white"
                    title={`${event.title} - ${event.location}`}
                  >
                    {event.title}
                  </div>
                ))}

                {dayEvents.length > 2 && (
                  <div className="text-xs font-medium text-zinc-500">
                    +{dayEvents.length - 2} más
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
