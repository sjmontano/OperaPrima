'use client'

import { useAuthModal } from '@/components/auth/AuthModalProvider'
import { ROUTES } from '@/constants'
import { X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const MENTOR_IMAGES = [
  {
    id: 'ana-restrepo',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1633885274964-d5a5d914bcb3?q=80&w=687&auto=format&fit=crop',
        alt: 'Ana Restrepo - retrato en estudio',
      },
      {
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=687&auto=format&fit=crop',
        alt: 'Ana Restrepo revisando portafolios',
      },
      {
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=687&auto=format&fit=crop',
        alt: 'Ana Restrepo compartiendo feedback creativo',
      },
    ],
  },
  {
    id: 'mateo-campos',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1589194837807-30a2f9540ad9?q=80&w=687&auto=format&fit=crop',
        alt: 'Mateo Campos - mentoría en proyectos culturales',
      },
      {
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=687&auto=format&fit=crop',
        alt: 'Mateo Campos analizando producción cultural',
      },
      {
        url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=687&auto=format&fit=crop',
        alt: 'Mateo Campos con equipo creativo',
      },
    ],
  },
  {
    id: 'laura-reyes',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1582644826651-f71401f0f3f6?q=80&w=687&auto=format&fit=crop',
        alt: 'Laura Reyes - asesoría de aplicaciones',
      },
      {
        url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=687&auto=format&fit=crop',
        alt: 'Laura Reyes guiando a un artista',
      },
      {
        url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=687&auto=format&fit=crop',
        alt: 'Laura Reyes en reunión creativa',
      },
    ],
  },
  {
    id: 'diego-salazar',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1614679967638-fe153775eff6?q=80&w=765&auto=format&fit=crop',
        alt: 'Diego Salazar - mentor de giras',
      },
      {
        url: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?q=80&w=765&auto=format&fit=crop',
        alt: 'Diego Salazar revisando producción',
      },
      {
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=765&auto=format&fit=crop',
        alt: 'Diego Salazar en actividad musical',
      },
    ],
  },
  {
    id: 'lucia-gomez',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1617195737496-bc30194e3a19?q=80&w=735&auto=format&fit=crop',
        alt: 'Lucía Gómez - finanzas artísticas',
      },
      {
        url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=735&auto=format&fit=crop',
        alt: 'Lucía Gómez en consulta financiera',
      },
      {
        url: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?q=80&w=735&auto=format&fit=crop',
        alt: 'Lucía Gómez trabajando con datos',
      },
    ],
  },
]

interface Mentor {
  id: string
  file: string
  name: string
  title: string
  location: string
  focus: string
  notes: string[]
}

interface ExpandingMentorsGalleryProps {
  mentors: Mentor[]
}

export function ExpandingMentorsGallery({ mentors }: ExpandingMentorsGalleryProps) {
  const authModal = useAuthModal()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [activeMentorId, setActiveMentorId] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [imageVisible, setImageVisible] = useState(true)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const getMentorPhotos = (mentorId: string) => {
    return MENTOR_IMAGES.find((item) => item.id === mentorId)?.photos || MENTOR_IMAGES[0].photos
  }

  const getMentorImage = (mentorId: string) => {
    return getMentorPhotos(mentorId)[0]
  }

  const handleCardClick = (mentorId: string) => {
    if (activeMentorId === mentorId) {
      setActiveMentorId(null)
      setExpandedId(null)
      return
    }

    setActiveMentorId(mentorId)
    setExpandedId(mentorId)
    setHoveredId(null)
  }

  const handleCloseModal = () => {
    setActiveMentorId(null)
    setExpandedId(null)
    setSelectedImageIndex(0)
    setImageVisible(true)
  }

  const handleWrapperMouseLeave = () => {
    if (expandedId === null) {
      setHoveredId(null)
    }
  }

  useEffect(() => {
    if (!activeMentorId) {
      setSelectedImageIndex(0)
      return
    }

    const photos = getMentorPhotos(activeMentorId)
    setSelectedImageIndex(0)
    setImageVisible(true)

    const interval = window.setInterval(() => {
      setSelectedImageIndex((index) => (index + 1) % photos.length)
    }, 3500)

    return () => window.clearInterval(interval)
  }, [activeMentorId])

  useEffect(() => {
    if (!activeMentorId) {
      return
    }

    setImageVisible(false)
    const timeout = window.setTimeout(() => setImageVisible(true), 50)
    return () => window.clearTimeout(timeout)
  }, [activeMentorId, selectedImageIndex])

  const getColumnFlex = (mentorId: string) => {
    if (expandedId !== null) {
      return expandedId === mentorId ? 3 : 0.5
    }

    if (hoveredId !== null) {
      return hoveredId === mentorId ? 3 : 0.5
    }

    return 1
  }

  const shouldShowOverlay = (mentorId: string) => {
    if (expandedId !== null) {
      return expandedId === mentorId
    }
    if (hoveredId !== null) {
      return hoveredId === mentorId
    }
    return false
  }

  const selectedMentor = activeMentorId
    ? mentors.find((mentor) => mentor.id === activeMentorId)
    : null

  return (
    <div className="w-full">
      {/* Desktop: Horizontal flex gallery */}
      <div
        ref={wrapperRef}
        onMouseLeave={handleWrapperMouseLeave}
        className={`mentor-gallery-wrapper hidden w-full gap-3 overflow-hidden md:flex ${expandedId ? 'has-expanded' : ''}`}
        style={{ height: '550px' }}
      >
        {mentors.map((mentor) => {
          const image = getMentorImage(mentor.id)
          const flex = getColumnFlex(mentor.id)
          const showOverlay = shouldShowOverlay(mentor.id)

          return (
            <div
              key={mentor.id}
              onMouseEnter={() => {
                if (expandedId === null) {
                  setHoveredId(mentor.id)
                }
              }}
              onClick={() => handleCardClick(mentor.id)}
              className={`mentor-card group relative cursor-pointer ${showOverlay ? 'mentor-card--expanded' : ''}`}
              style={{
                flex: `${flex}`,
              }}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="mentor-card__image"
                style={{
                  transform: showOverlay ? 'scale(1.08)' : 'scale(1)',
                }}
              />

              <div className="mentor-card__overlay" aria-hidden={!showOverlay}>
                <span className="mentor-card__label">{mentor.file}</span>
                <h3 className="mentor-card__name">{mentor.name}</h3>
                <p className="mentor-card__role">{mentor.title}</p>
                <p className="mentor-card__location">{mentor.location}</p>
                <p className="mentor-card__focus">{mentor.focus}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Mobile: Vertical stacked gallery */}
      <div className="flex w-full flex-col gap-3 md:hidden">
        {mentors.map((mentor) => {
          const image = getMentorImage(mentor.id)
          const isSelected = activeMentorId === mentor.id

          return (
            <div
              key={mentor.id}
              onClick={() => handleCardClick(mentor.id)}
              className={`mentor-card group relative cursor-pointer ${isSelected ? 'mentor-card--expanded' : ''}`}
              style={{
                height: isSelected ? '420px' : '180px',
              }}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="mentor-card__image"
                style={{
                  transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                }}
              />

              <div className="mentor-card__overlay">
                <span className="mentor-card__label">{mentor.file}</span>
                <h3 className="mentor-card__name">{mentor.name}</h3>
                <p className="mentor-card__role">{mentor.title}</p>
                <p className="mentor-card__location">{mentor.location}</p>
                <p className="mentor-card__focus">{mentor.focus}</p>
                <ul className="mentor-card__notes">
                  {mentor.notes.map((note) => (
                    <li key={note} className="mentor-card__note">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>

      {selectedMentor && (
        <div className="mentor-card-modal fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="mentor-card-modal__backdrop absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          <div className="mentor-card-modal__content relative z-10 w-full max-w-5xl overflow-hidden border-2 border-white/10 bg-[#0f0f0f] shadow-[8px_8px_0_#111]">
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-20 inline-flex h-10 w-10 items-center justify-center border-2 border-white/20 text-white transition hover:border-[#F65B7F] hover:text-[#F65B7F]"
            >
              <X size={18} />
              <span className="sr-only">Cerrar</span>
            </button>

            <div className="grid gap-0 lg:grid-cols-[1fr_1.2fr]">
              <div className="relative h-72 lg:h-full">
                <img
                  src={getMentorPhotos(selectedMentor.id)[selectedImageIndex].url}
                  alt={getMentorPhotos(selectedMentor.id)[selectedImageIndex].alt}
                  className={`h-full w-full object-cover object-center transition-opacity duration-700 ease-out ${imageVisible ? 'opacity-100' : 'opacity-0'}`}
                />
                <div className="absolute right-4 bottom-4 left-4 flex items-center justify-center gap-2">
                  {getMentorPhotos(selectedMentor.id).map((photo, index) => (
                    <span
                      key={photo.url}
                      className={`h-2 rounded-full transition-all duration-200 ${index === selectedImageIndex ? 'w-8 bg-[#F65B7F]' : 'w-2 bg-white/30'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="p-8 sm:p-10">
                <span className="mentor-card__label">{selectedMentor.file}</span>
                <h3 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-white">
                  {selectedMentor.name}
                </h3>
                <p className="mt-3 text-lg font-semibold text-white/85">{selectedMentor.title}</p>
                <p className="mt-2 text-sm font-medium text-[#F65B7F]">{selectedMentor.location}</p>
                <p className="mt-6 text-base leading-7 text-white/70">{selectedMentor.focus}</p>

                <div className="mt-8 space-y-6 border-t border-white/10 pt-8 text-white/85">
                  <div>
                    <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
                      Temas que trabajamos
                    </p>
                    <ul className="mt-4 grid gap-3">
                      {selectedMentor.notes.map((note) => (
                        <li
                          key={note}
                          className="rounded-none border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6"
                        >
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-8 space-y-3 border-t border-white/10 pt-8">
                    <button
                      type="button"
                      onClick={() => authModal.open('registro')}
                      className="inline-flex w-full items-center justify-center rounded-none border-2 border-[#F65B7F] bg-[#F65B7F] px-6 py-3 text-sm font-bold tracking-widest text-white uppercase shadow-[4px_4px_0_#111] transition-all duration-150 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#F65B7F] hover:bg-transparent hover:text-[#F65B7F] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      Reservar mentoría
                    </button>

                    <Link
                      href={ROUTES.MENTOR_PROFILE(selectedMentor.id)}
                      onClick={handleCloseModal}
                      className="inline-flex w-full items-center justify-center rounded-none border-2 border-white/20 bg-transparent px-6 py-3 text-sm font-bold tracking-widest text-white uppercase transition-all duration-150 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#F65B7F] hover:text-[#F65B7F] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      Ver perfil
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
