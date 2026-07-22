'use client'

import { useAuthModal } from '@/components/auth/AuthModalProvider'
import { Pencil, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export interface MentorCard {
  id: string
  usuarioId: string | null
  username: string | null
  name: string
  title: string
  location: string
  focus: string
  notes: string[]
  galleryImages: { url: string; alt: string }[] | null
  avatar: string | null
}

interface ExpandingMentorsGalleryProps {
  mentors: MentorCard[]
  canEdit?: (mentor: MentorCard) => boolean
  onEdit?: (mentor: MentorCard) => void
  onDelete?: (mentor: MentorCard) => void
}

export function ExpandingMentorsGallery({
  mentors,
  canEdit,
  onEdit,
  onDelete,
}: ExpandingMentorsGalleryProps) {
  const authModal = useAuthModal()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [activeMentorId, setActiveMentorId] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [imageVisible, setImageVisible] = useState(true)
  const wrapperRef = useRef<HTMLDivElement>(null)

  function getMentorPhotos(mentor: MentorCard) {
    if (mentor.galleryImages && mentor.galleryImages.length > 0) {
      return mentor.galleryImages
    }
    if (mentor.avatar) {
      return [{ url: mentor.avatar, alt: mentor.name }]
    }
    return [{ url: '', alt: mentor.name }]
  }

  function getMentorImage(mentor: MentorCard) {
    return getMentorPhotos(mentor)[0]
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
      const id = requestAnimationFrame(() => setSelectedImageIndex(0))
      return () => cancelAnimationFrame(id)
    }
    const mentor = mentors.find((m) => m.id === activeMentorId)
    const photos = mentor ? getMentorPhotos(mentor) : []
    const id = requestAnimationFrame(() => {
      setSelectedImageIndex(0)
      setImageVisible(true)
    })

    if (photos.length <= 1) return () => cancelAnimationFrame(id)

    const interval = window.setInterval(() => {
      setSelectedImageIndex((index) => (index + 1) % photos.length)
    }, 3500)

    return () => {
      cancelAnimationFrame(id)
      window.clearInterval(interval)
    }
  }, [activeMentorId, mentors])

  useEffect(() => {
    if (!activeMentorId) return
    const raf = requestAnimationFrame(() => setImageVisible(false))
    const timeout = window.setTimeout(() => setImageVisible(true), 50)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timeout)
    }
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
    if (expandedId !== null) return expandedId === mentorId
    if (hoveredId !== null) return hoveredId === mentorId
    return false
  }

  const selectedMentor = activeMentorId
    ? mentors.find((mentor) => mentor.id === activeMentorId) || null
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
          const image = getMentorImage(mentor)
          const flex = getColumnFlex(mentor.id)
          const showOverlay = shouldShowOverlay(mentor.id)

          return (
            <div
              key={mentor.id}
              onMouseEnter={() => {
                if (expandedId === null) setHoveredId(mentor.id)
              }}
              onClick={() => handleCardClick(mentor.id)}
              className={`mentor-card group relative cursor-pointer ${showOverlay ? 'mentor-card--expanded' : ''}`}
              style={{ flex: `${flex}` }}
            >
              {onDelete && canEdit && canEdit(mentor) && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(mentor)
                  }}
                  className="absolute top-2 right-2 z-30 flex h-7 w-7 items-center justify-center border-2 border-red-500 bg-red-500 text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-white hover:text-red-500"
                >
                  <X size={14} />
                  <span className="sr-only">Eliminar mentor</span>
                </button>
              )}
              {image.url ? (
                <img
                  src={image.url}
                  alt={image.alt}
                  className="mentor-card__image"
                  style={{ transform: showOverlay ? 'scale(1.08)' : 'scale(1)' }}
                />
              ) : (
                <div className="mentor-card__image flex items-center justify-center bg-zinc-200">
                  <span className="text-3xl font-bold text-zinc-400">
                    {mentor.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                </div>
              )}

              <div className="mentor-card__overlay" aria-hidden={!showOverlay}>
                <span className="mentor-card__label">
                  {mentor.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
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
          const image = getMentorImage(mentor)
          const isSelected = activeMentorId === mentor.id

          return (
            <div
              key={mentor.id}
              onClick={() => handleCardClick(mentor.id)}
              className={`mentor-card group relative cursor-pointer ${isSelected ? 'mentor-card--expanded' : ''}`}
              style={{ height: isSelected ? '420px' : '180px' }}
            >
              {onDelete && canEdit && canEdit(mentor) && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(mentor)
                  }}
                  className="absolute top-2 right-2 z-30 flex h-7 w-7 items-center justify-center border-2 border-red-500 bg-red-500 text-white transition-all hover:bg-white hover:text-red-500"
                >
                  <X size={14} />
                  <span className="sr-only">Eliminar mentor</span>
                </button>
              )}
              {image.url ? (
                <img
                  src={image.url}
                  alt={image.alt}
                  className="mentor-card__image"
                  style={{ transform: isSelected ? 'scale(1.08)' : 'scale(1)' }}
                />
              ) : (
                <div className="mentor-card__image flex items-center justify-center bg-zinc-200">
                  <span className="text-2xl font-bold text-zinc-400">
                    {mentor.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                </div>
              )}

              <div className="mentor-card__overlay">
                <span className="mentor-card__label">
                  {mentor.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
                <h3 className="mentor-card__name">{mentor.name}</h3>
                <p className="mentor-card__role">{mentor.title}</p>
                <p className="mentor-card__location">{mentor.location}</p>
                <p className="mentor-card__focus">{mentor.focus}</p>
                <ul className="mentor-card__notes">
                  {mentor.notes.filter(Boolean).map((note) => (
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
              className="absolute top-4 right-4 z-20 inline-flex h-10 w-10 items-center justify-center border-2 border-white/20 text-white transition hover:border-[#8ECAE6] hover:text-[#8ECAE6]"
            >
              <X size={18} />
              <span className="sr-only">Cerrar</span>
            </button>

            <div className="grid gap-0 lg:grid-cols-[1fr_1.2fr]">
              <div className="relative h-72 lg:h-full">
                {getMentorPhotos(selectedMentor).length > 0 &&
                getMentorPhotos(selectedMentor)[0].url ? (
                  <>
                    <img
                      src={getMentorPhotos(selectedMentor)[selectedImageIndex].url}
                      alt={getMentorPhotos(selectedMentor)[selectedImageIndex].alt}
                      className={`h-full w-full object-cover object-center transition-opacity duration-700 ease-out ${imageVisible ? 'opacity-100' : 'opacity-0'}`}
                    />
                    {getMentorPhotos(selectedMentor).length > 1 && (
                      <div className="absolute right-4 bottom-4 left-4 flex items-center justify-center gap-2">
                        {getMentorPhotos(selectedMentor).map((photo, index) => (
                          <span
                            key={photo.url}
                            className={`h-2 rounded-full transition-all duration-200 ${index === selectedImageIndex ? 'w-8 bg-[#8ECAE6]' : 'w-2 bg-white/30'}`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-800">
                    <span className="text-5xl font-bold text-zinc-600">
                      {selectedMentor.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-8 sm:p-10">
                <span className="mentor-card__label">
                  {selectedMentor.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
                <h3 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-white">
                  {selectedMentor.name}
                </h3>
                <p className="mt-3 text-lg font-semibold text-white/85">{selectedMentor.title}</p>
                <p className="mt-2 text-sm font-medium text-[#8ECAE6]">{selectedMentor.location}</p>
                <p className="mt-6 text-base leading-7 text-white/70">{selectedMentor.focus}</p>

                {selectedMentor.notes.filter(Boolean).length > 0 && (
                  <div className="mt-8 space-y-6 border-t border-white/10 pt-8 text-white/85">
                    <div>
                      <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#8ECAE6] uppercase">
                        Temas que trabajamos
                      </p>
                      <ul className="mt-4 grid gap-3">
                        {selectedMentor.notes.filter(Boolean).map((note) => (
                          <li
                            key={note}
                            className="rounded-none border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6"
                          >
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="mt-8 space-y-3 border-t border-white/10 pt-8">
                  {canEdit && onEdit && canEdit(selectedMentor) && (
                    <button
                      type="button"
                      onClick={() => {
                        onEdit(selectedMentor)
                        handleCloseModal()
                      }}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-none border-2 border-[#8ECAE6] bg-[#8ECAE6] px-6 py-3 text-sm font-bold tracking-widest text-[#023047] uppercase shadow-[4px_4px_0_#353535] transition-all duration-150 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#8ECAE6] hover:bg-transparent hover:text-[#8ECAE6] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      <Pencil size={14} />
                      Editar tarjeta
                    </button>
                  )}
                  {onDelete && canEdit && canEdit(selectedMentor) && (
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(selectedMentor)
                        handleCloseModal()
                      }}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-none border-2 border-red-500 bg-red-500 px-6 py-3 text-sm font-bold tracking-widest text-white uppercase shadow-[4px_4px_0_#353535] transition-all duration-150 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-red-500 hover:bg-transparent hover:text-red-500 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      <X size={14} />
                      Eliminar mentor
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => authModal.open('registro')}
                    className="inline-flex w-full items-center justify-center rounded-none border-2 border-[#E63946] bg-[#E63946] px-6 py-3 text-sm font-bold tracking-widest text-white uppercase shadow-[4px_4px_0_#353535] transition-all duration-150 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#E63946] hover:bg-transparent hover:text-[#E63946] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  >
                    Reservar mentoría
                  </button>
                  {selectedMentor.username ? (
                    <Link
                      href={`/perfil/${selectedMentor.username}`}
                      onClick={handleCloseModal}
                      className="inline-flex w-full items-center justify-center rounded-none border-2 border-white/20 bg-transparent px-6 py-3 text-sm font-bold tracking-widest text-white uppercase transition-all duration-150 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#8ECAE6] hover:text-[#8ECAE6] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      Ver perfil
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
