import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { GroupMatches } from './GroupMatches'
import type { GroupData } from '../lib/types'

type PredictionGroupCarouselProps = {
  groups: GroupData[]
  currentGroupIndex: number
  disabled: boolean
  readOnlyAppearance?: boolean
  onScoreChange: (gameId: number, team: 0 | 1, score: number | null) => void
  pointsByGameId?: Record<number, bigint>
  onOpenTeamInfo: (teamId: number) => void
  onSelectGroupIndex: (index: number) => void
}

const SWIPE_THRESHOLD_PX = 56

export function PredictionGroupCarousel({
  groups,
  currentGroupIndex,
  disabled,
  readOnlyAppearance = false,
  onScoreChange,
  pointsByGameId,
  onOpenTeamInfo,
  onSelectGroupIndex,
}: PredictionGroupCarouselProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const transitionTimeoutRef = useRef<number | null>(null)
  const gestureRef = useRef<{
    pointerId: number | null
    startX: number
    startY: number
    width: number
    axis: 'x' | 'y' | null
  }>({
    pointerId: null,
    startX: 0,
    startY: 0,
    width: 0,
    axis: null,
  })

  const [dragOffset, setDragOffset] = useState(0)
  const [transitionEnabled, setTransitionEnabled] = useState(false)
  const [pendingGroupIndex, setPendingGroupIndex] = useState<number | null>(null)

  const currentGroup = groups[currentGroupIndex] ?? null
  const previousGroup = currentGroupIndex > 0 ? groups[currentGroupIndex - 1] : null
  const nextGroup = currentGroupIndex < groups.length - 1 ? groups[currentGroupIndex + 1] : null
  const canGoPrevious = previousGroup !== null
  const canGoNext = nextGroup !== null

  useEffect(() => {
    clearTransitionTimeout()
    setDragOffset(0)
    setTransitionEnabled(false)
    setPendingGroupIndex(null)
  }, [currentGroupIndex])

  useEffect(() => {
    return () => clearTransitionTimeout()
  }, [])

  const trackStyle = useMemo(
    () => ({
      transform: `translateX(calc(-100% + ${dragOffset}px))`,
      transition: transitionEnabled ? 'transform 220ms ease' : 'none',
    }),
    [dragOffset, transitionEnabled],
  )

  const getViewportWidth = () => viewportRef.current?.getBoundingClientRect().width ?? 0

  const clearTransitionTimeout = () => {
    if (transitionTimeoutRef.current === null) return
    window.clearTimeout(transitionTimeoutRef.current)
    transitionTimeoutRef.current = null
  }

  const completeTransition = (nextIndex: number | null) => {
    clearTransitionTimeout()
    setTransitionEnabled(false)
    setPendingGroupIndex(null)
    setDragOffset(0)

    if (nextIndex !== null) {
      onSelectGroupIndex(nextIndex)
    }
  }

  const resetGesture = () => {
    gestureRef.current.pointerId = null
    gestureRef.current.axis = null
  }

  const animateToGroup = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= groups.length || targetIndex === currentGroupIndex) return

    const width = getViewportWidth()
    if (width <= 0) {
      onSelectGroupIndex(targetIndex)
      return
    }

    clearTransitionTimeout()
    setPendingGroupIndex(targetIndex)
    setTransitionEnabled(true)
    setDragOffset(targetIndex > currentGroupIndex ? -width : width)

    // Fallback in case the browser misses transitionend on the track element.
    transitionTimeoutRef.current = window.setTimeout(() => {
      completeTransition(targetIndex)
    }, 260)
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'touch') return

    const target = event.target instanceof HTMLElement ? event.target : null
    if (target?.closest('input, button, textarea, select, [role="button"]')) return

    gestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      width: getViewportWidth(),
      axis: null,
    }

    event.currentTarget.setPointerCapture(event.pointerId)
    setTransitionEnabled(false)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (gestureRef.current.pointerId !== event.pointerId) return

    const deltaX = event.clientX - gestureRef.current.startX
    const deltaY = event.clientY - gestureRef.current.startY

    if (gestureRef.current.axis === null) {
      if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return
      gestureRef.current.axis = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y'
    }

    if (gestureRef.current.axis !== 'x') return

    const width = gestureRef.current.width || getViewportWidth() || 1
    let nextOffset = Math.max(-width * 0.85, Math.min(width * 0.85, deltaX))

    if (nextOffset > 0 && !canGoPrevious) nextOffset *= 0.25
    if (nextOffset < 0 && !canGoNext) nextOffset *= 0.25

    setDragOffset(nextOffset)
  }

  const finishPointerGesture = (event: React.PointerEvent<HTMLDivElement>) => {
    if (gestureRef.current.pointerId !== event.pointerId) return

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    const width = gestureRef.current.width || getViewportWidth()
    const shouldGoPrevious = dragOffset > SWIPE_THRESHOLD_PX && canGoPrevious
    const shouldGoNext = dragOffset < -SWIPE_THRESHOLD_PX && canGoNext

    resetGesture()

    if (width > 0 && (shouldGoPrevious || shouldGoNext)) {
      animateToGroup(currentGroupIndex + (shouldGoPrevious ? -1 : 1))
      return
    }

    setPendingGroupIndex(null)
    setTransitionEnabled(true)
    setDragOffset(0)
    clearTransitionTimeout()
    transitionTimeoutRef.current = window.setTimeout(() => {
      completeTransition(null)
    }, 260)
  }

  if (!currentGroup) return null

  return (
    <div className="space-y-3">
      <div
        ref={viewportRef}
        className="overflow-hidden"
        style={{ touchAction: 'pan-y' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointerGesture}
        onPointerCancel={finishPointerGesture}
      >
        <div
          className="flex"
          style={trackStyle}
          onTransitionEnd={(event) => {
            if (event.target !== event.currentTarget || !transitionEnabled) return
            completeTransition(pendingGroupIndex)
          }}
        >
          <div className="min-w-full">
            {previousGroup ? (
              <GroupMatches
                groupLabel={previousGroup.groupLabel}
                games={previousGroup.games}
                disabled={disabled}
                readOnlyAppearance={readOnlyAppearance}
                onScoreChange={onScoreChange}
                pointsByGameId={pointsByGameId}
                onOpenTeamInfo={onOpenTeamInfo}
              />
            ) : (
              <div className="h-full rounded-xl border border-dashed" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
            )}
          </div>

          <div className="min-w-full">
            <GroupMatches
              groupLabel={currentGroup.groupLabel}
              games={currentGroup.games}
              disabled={disabled}
              readOnlyAppearance={readOnlyAppearance}
              onScoreChange={onScoreChange}
              pointsByGameId={pointsByGameId}
              onOpenTeamInfo={onOpenTeamInfo}
            />
          </div>

          <div className="min-w-full">
            {nextGroup ? (
              <GroupMatches
                groupLabel={nextGroup.groupLabel}
                games={nextGroup.games}
                disabled={disabled}
                readOnlyAppearance={readOnlyAppearance}
                onScoreChange={onScoreChange}
                pointsByGameId={pointsByGameId}
                onOpenTeamInfo={onOpenTeamInfo}
              />
            ) : (
              <div className="h-full rounded-xl border border-dashed" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          aria-label="Grupo anterior"
          disabled={!canGoPrevious || transitionEnabled}
          className="flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-35"
          style={{
            borderColor: 'var(--border-color)',
            background: 'var(--bg-card)',
            color: 'var(--text-secondary)',
          }}
          onClick={() => animateToGroup(currentGroupIndex - 1)}
        >
          <ChevronLeft size={18} />
          <span>Anterior</span>
        </button>

        <button
          type="button"
          aria-label="Grupo siguiente"
          disabled={!canGoNext || transitionEnabled}
          className="flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-35"
          style={{
            borderColor: 'var(--border-color)',
            background: 'var(--bg-card)',
            color: 'var(--text-secondary)',
          }}
          onClick={() => animateToGroup(currentGroupIndex + 1)}
        >
          <span>Siguiente</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
