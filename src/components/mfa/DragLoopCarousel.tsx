// Infinite Drag Carousel by Made for Award: https://www.madeforaward.com/ui/galleries/drag-loop-carousel
// Free and open source (MIT). If it helped, a star means a lot: https://github.com/shivc868/madeforaward-ui
'use client'

import {useRef} from 'react'
import {gsap} from 'gsap'
import {useGSAP} from '@gsap/react'
import {Draggable} from 'gsap/Draggable'
import {InertiaPlugin} from 'gsap/InertiaPlugin'

gsap.registerPlugin(useGSAP, Draggable, InertiaPlugin)

/** A card: its image, and optionally its own width (px at a 1440px-wide
 * box, 3:4 frame) and lift (downward offset, px) in the scatter. */
export type DragLoopImage = {src: string; width?: number; lift?: number}

export type DragLoopCarouselProps = {
  images?: (string | DragLoopImage)[]
  /** drift speed at the centre of a 1440px-wide box, px/s (scales with the box) */
  speed?: number
  /** gap between cards at the centre, px */
  gap?: number
  /** card scale at both edges (1 at the centre): the strength of the lens */
  minScale?: number
  /** card corner radius, px */
  radius?: number
  background?: string
  className?: string
}

// The scatter rhythm cards fall into when they carry no size of their own.
// It belongs to the card (not the loop copy) so the wrap seam stays invisible.
const SCATTER = [
  [300, 0], [260, 92], [344, 38], [288, 148], [320, 20], [272, 112], [304, 60], [332, 132],
  [284, 76], [316, 8], [264, 124], [336, 48], [292, 140], [308, 28], [268, 100], [324, 64],
]
const DEFAULT_IMAGES = ['/images/hero-women.jpg', '/images/hero-men.jpg', '/images/hero-kids.jpg']

// A constant-speed row of cards seen through a fixed fisheye lens: cards
// magnify toward the centre and shrink to the edges, drift on their own, and
// can be grabbed and thrown (Draggable + Inertia). Fills its parent.
export default function DragLoopCarousel({
  images = DEFAULT_IMAGES,
  speed = 500,
  gap = 10,
  minScale = 0.1,
  radius = 16,
  background = '#000000',
  className = '',
}: DragLoopCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  // row position as a fraction of one set, kept across rebuilds so a prop
  // change or resize never jumps the loop
  const progress = useRef(0)

  const cards = images.map((image, i) => {
    const {src, width, lift} = typeof image === 'string' ? {src: image} : image
    const [w, l] = SCATTER[i % SCATTER.length]
    return {src, width: width ?? w, lift: lift ?? l}
  })
  const count = cards.length
  const layoutKey = cards.map((c) => `${c.width}/${c.lift}`).join(',')
  // height of the row at full size: the tallest card (3:4) plus its lift
  const rowHeight = Math.max(1, ...cards.map((c) => c.lift + (c.width * 4) / 3))

  useGSAP(
    () => {
      const root = rootRef.current
      const track = trackRef.current
      const items = itemRefs.current.slice(0, count * 3) as HTMLDivElement[]
      if (!root || !track || !count || items.some((el) => !el)) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
      let teardown = () => {}

      // Everything is measured, so it is rebuilt whenever the box resizes.
      const build = () => {
        teardown()

        // --s scales every width, lift and gap together: 1 in a 1440px-wide
        // box, and never taller than the box (minus breathing room).
        const fitW = root.offsetWidth / 1440
        const fitH = (root.offsetHeight - 96) / rowHeight
        track.style.setProperty('--s', String(gsap.utils.clamp(0.45, 1, Math.min(fitW, fitH))))

        const setWidth = items[count].offsetLeft - items[0].offsetLeft
        if (setWidth <= 0) return
        const pxPerSec = (speed * root.offsetWidth) / 1440

        // F warps the x axis: magnification 1 at the centre easing (cosine)
        // to minScale at both edges, normalised so the box maps onto itself.
        // Each card's two edges go through F; its scale and shift follow.
        const center = root.offsetWidth / 2
        const mean = (1 + minScale) / 2
        const R = center / mean // half the row length the lens sees
        const F = (q: number) => {
          const u = gsap.utils.clamp(-R, R, q - center)
          const lens = mean * u + ((1 - minScale) * R * Math.sin((Math.PI * u) / R)) / (2 * Math.PI)
          return center + lens + (q - center - u) * minScale
        }

        const lefts = items.map((el) => el.offsetLeft)
        const widths = items.map((el) => el.offsetWidth)
        // one "css" setter per card: x and scale land in one transform write
        const setCard = items.map((el) => gsap.quickSetter(el, 'css'))

        // The track never moves: the row offset is folded into each card's
        // transform. The middle of three copies is on screen; wrap keeps it there.
        const paint = (x: number) => {
          for (let i = 0; i < items.length; i++) {
            const l = F(lefts[i] + x)
            const r = F(lefts[i] + x + widths[i])
            setCard[i]({x: (l + r) / 2 - (lefts[i] + widths[i] / 2), scale: (r - l) / widths[i]})
          }
        }

        const wrap = gsap.utils.wrap(-2 * setWidth, -setWidth)
        let offset = -2 * setWidth + progress.current * setWidth
        let dragging = false

        let visible = false
        let lastPaintedX = Number.NaN
        const tick = (_: number, dt: number) => {
          if (!visible) return
          if (!dragging && !reduced.matches) offset -= (pxPerSec * dt) / 1000
          const x = wrap(offset)
          progress.current = (x + 2 * setWidth) / setWidth
          if (x !== lastPaintedX) {
            paint(x)
            lastPaintedX = x
          }
        }
        gsap.ticker.add(tick)
        const visibilityObserver = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting
          if (visible) {
            const x = wrap(offset)
            paint(x)
            lastPaintedX = x
          }
        }, {threshold: 0.01})
        visibilityObserver.observe(root)

        // Draggable drives a detached proxy; we only read its x.
        const proxy = document.createElement('div')
        const sync = () => {
          offset = Number(gsap.getProperty(proxy, 'x'))
        }
        const [drag] = Draggable.create(proxy, {
          type: 'x',
          trigger: root,
          inertia: true,
          cursor: 'grab',
          activeCursor: 'grabbing',
          allowNativeTouchScrolling: true,
          onPressInit() {
            gsap.set(proxy, {x: offset})
            dragging = true
          },
          onDrag: sync,
          onThrowUpdate: sync,
          onRelease() {
            if (!drag.isThrowing) dragging = false
          },
          onThrowComplete() {
            dragging = false
          },
        })

        // paint now, so a resize never shows a frame of stale transforms
        paint(wrap(offset))

        teardown = () => {
          gsap.ticker.remove(tick)
          visibilityObserver.disconnect()
          drag.kill()
        }
      }

      build()
      const observer = new ResizeObserver(build)
      observer.observe(root)

      return () => {
        observer.disconnect()
        teardown()
      }
    },
    {scope: rootRef, dependencies: [layoutKey, speed, gap, minScale], revertOnUpdate: true},
  )

  return (
    <div
      ref={rootRef}
      role="region"
      aria-label="Gallery"
      className={`relative flex h-full w-full select-none items-center overflow-hidden ${className}`}
      style={{background}}
    >
      <div ref={trackRef} className="flex w-max shrink-0 items-start" style={{columnGap: `calc(${gap}px * var(--s, 1))`}}>
        {[...cards, ...cards, ...cards].map((card, i) => (
          <div
            key={i}
            ref={(el) => {
              itemRefs.current[i] = el
            }}
            className="shrink-0 will-change-transform"
            style={{width: `calc(${card.width}px * var(--s, 1))`, marginTop: `calc(${card.lift}px * var(--s, 1))`}}
            aria-hidden={i >= count || undefined}
          >
            <div className="aspect-[3/4] overflow-hidden bg-[#141414]" style={{borderRadius: radius}}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.src}
                alt="Illustrative salon style"
                draggable={false}
                loading={i < count ? 'eager' : 'lazy'}
                className="pointer-events-none h-full w-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
