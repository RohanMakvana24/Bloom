import React, { useEffect, useRef, useState } from 'react';
import {
  UNISEX_SERVICES,
  UNISEX_SERVICE_ITEMS,
  DEPTH_KX,
  DEPTH_KF,
  DEPTH_KH,
  DEPTH_KB,
  DEPTH_KO,
  wrapMod,
  clampVal,
  computeModelDepth,
  interpolateDepthTable,
  computeRailCardOffset,
} from '@/lib/salon-services-config';
import { RunwayBottleSvg, CardProductSvg } from '@/components/salon-product-artwork';

const BOTTLE_HEIGHT_SVG = 520;
const N = UNISEX_SERVICES.length;

export const SalonServicesLookbook: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const rollRef = useRef<HTMLSpanElement | null>(null);
  const modelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});

  // Imperative animation engine refs matching the Runway Depth Lookbook rules + mobile responsiveness
  const engineRef = useRef({
    W: 0,
    H: 0,
    effectiveH: 0,
    base: 0,
    cardS: 0,
    side: false,
    dirty: true,
    p: 0,
    target: 0,
    last: 0,
    lastInteraction: 0,
    inView: true,
    hovered: false,
    mx: 0,
    my: 0,
    cx: 0,
    cy: 0,
    down: false,
    sx: 0,
    sy: 0,
    st: 0,
    moved: 0,
    wheelT: 0 as unknown as ReturnType<typeof setTimeout>,
    activeIdx: 0,
    modelCache: UNISEX_SERVICES.map((svc) => ({
      r: (svc.cropBox[1] - svc.cropBox[0]) / BOTTLE_HEIGHT_SVG,
      f: '',
      o: '',
    })),
    kick: () => {},
  });

  const jumpToService = (serviceIdx: number) => {
    const eng = engineRef.current;
    eng.lastInteraction = performance.now();
    const currentBase = Math.round(eng.target);
    const currentMod = wrapMod(currentBase, N);
    let delta = serviceIdx - currentMod;
    if (delta > N / 2) delta -= N;
    if (delta < -N / 2) delta += N;
    eng.target = currentBase + delta;
    eng.dirty = true;
    eng.kick();
  };

  const stepService = (delta: number) => {
    const eng = engineRef.current;
    eng.lastInteraction = performance.now();
    eng.target = Math.round(eng.target) + delta;
    eng.dirty = true;
    eng.kick();
  };

  useEffect(() => {
    const section = sectionRef.current;
    const main = mainRef.current;
    const stage = stageRef.current;
    const rail = railRef.current;
    const ring = ringRef.current;
    const roll = rollRef.current;
    if (!section || !main || !stage || !rail || !ring || !roll) return;

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const eng = engineRef.current;
    eng.lastInteraction = performance.now();

    function size() {
      if (!stage || !rail || !roll) return;
      eng.W = stage.clientWidth;
      eng.H = stage.clientHeight;
      eng.side = window.innerWidth <= 820;
      // On narrow mobile screens, scale bottles relative to width so all 8 fit cleanly without colliding with text
      eng.effectiveH = eng.side ? Math.min(eng.H * 0.78, eng.W * 0.96) : eng.H;
      eng.base = Math.max(180, eng.effectiveH * 1.2);

      eng.modelCache.forEach((m, i) => {
        const el = modelRefs.current[i];
        if (!el) return;
        el.style.width = `${eng.base * m.r}px`;
        el.style.height = `${eng.base}px`;
      });

      eng.cardS = eng.side ? Math.min(184, Math.max(156, window.innerWidth * 0.45)) : rail.clientHeight / 3;
      cardRefs.current.forEach((c) => {
        if (!c) return;
        if (eng.side) {
          c.style.width = `${eng.cardS}px`;
          c.style.height = '100%';
        } else {
          c.style.width = '100%';
          c.style.height = `${eng.cardS}px`;
        }
      });

      eng.dirty = true;
    }

    function paint() {
      if (!roll) return;
      eng.modelCache.forEach((m, i) => {
        const el = modelRefs.current[i];
        if (!el) return;
        const d = computeModelDepth(i, eng.p, N);
        const kh = interpolateDepthTable(d, DEPTH_KH);
        const kx = interpolateDepthTable(d, DEPTH_KX);
        const kf = interpolateDepthTable(d, DEPTH_KF);
        const kb = interpolateDepthTable(d, DEPTH_KB);
        const ko = interpolateDepthTable(d, DEPTH_KO);

        const h = kh * eng.effectiveH;
        const s = eng.base > 0 ? h / eng.base : 1;
        const w = h * m.r;
        const kxAdj = eng.side ? 0.14 + kx * 0.76 : kx;
        const x = kxAdj * eng.W - w / 2;
        const y = (eng.side ? 0.14 + kf * 0.84 : kf) * eng.H - h;

        el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${s.toFixed(4)})`;
        const rawBlur = s > 0 ? kb / s : 0;
        const cappedBlur = eng.side ? Math.min(4.5, rawBlur * 0.65) : rawBlur;
        const roundedBlur = Math.round(cappedBlur * 2) / 2;
        const fs = roundedBlur < 0.5 ? 'none' : `blur(${roundedBlur.toFixed(1)}px)`;
        const o = ko.toFixed(3);

        if (fs !== m.f) {
          m.f = fs;
          el.style.filter = fs;
        }
        if (o !== m.o) {
          m.o = o;
          el.style.opacity = o;
        }
        el.style.zIndex = String(100 - Math.round(d * 10));
      });

      const totalCards = UNISEX_SERVICE_ITEMS.length;
      cardRefs.current.forEach((c, i) => {
        if (!c) return;
        const offset = computeRailCardOffset(i, eng.p, eng.cardS, totalCards);
        c.style.transform = eng.side
          ? `translate3d(${offset.toFixed(1)}px,0,0)`
          : `translate3d(0,${offset.toFixed(1)}px,0)`;
      });

      const firstRollItem = roll.firstElementChild as HTMLElement | null;
      const lineH = firstRollItem ? firstRollItem.offsetHeight : 38;
      roll.style.transform = `translate3d(0,${(-wrapMod(eng.p, N) * lineH).toFixed(1)}px,0)`;

      const nearestIdx = wrapMod(Math.round(eng.p), N);
      if (nearestIdx !== eng.activeIdx) {
        eng.activeIdx = nearestIdx;
        setActiveIndex(nearestIdx);
      }
    }

    let rafId = 0;
    function frame(now: number) {
      rafId = 0;
      const dt = Math.min(50, now - eng.last) || 16;
      eng.last = now;
      const was = eng.p;
      if (calm) {
        eng.p = eng.target;
      } else {
        eng.p += (eng.target - eng.p) * (1 - Math.exp(-dt * 0.0085));
      }
      if (Math.abs(eng.target - eng.p) < 0.0004) {
        eng.p = eng.target;
      }
      if (eng.p !== was || eng.dirty) {
        eng.dirty = false;
        paint();
      }
      eng.cx += (eng.mx - eng.cx) * 0.32;
      eng.cy += (eng.my - eng.cy) * 0.32;
      if (ring && !eng.side) {
        ring.style.transform = `translate3d(${eng.cx.toFixed(1)}px,${eng.cy.toFixed(1)}px,0)`;
      }
      const ringMoving = !eng.side && Math.abs(eng.mx - eng.cx) + Math.abs(eng.my - eng.cy) > 0.15;
      const lookMoving = Math.abs(eng.target - eng.p) > 0.0004 || eng.dirty;
      if (ringMoving || lookMoving) {
        rafId = requestAnimationFrame(frame);
      }
    }

    function kick() {
      if (rafId) return;
      eng.last = performance.now();
      rafId = requestAnimationFrame(frame);
    }
    eng.kick = kick;

    const pull = () => (eng.side ? Math.max(95, eng.W * 0.28) : Math.max(150, eng.W * 0.2));

    const onPointerEnter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') {
        eng.hovered = true;
        ring.classList.add('show');
      }
    };
    const onPointerLeave = () => {
      eng.hovered = false;
      ring.classList.remove('show');
    };
    const onPointerMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      eng.mx = e.clientX - r.left;
      eng.my = e.clientY - r.top;
      if (eng.down) {
        eng.lastInteraction = performance.now();
        const dx = e.clientX - eng.sx;
        const dy = e.clientY - eng.sy;
        // On mobile, if user is scrolling vertically more than horizontally at the start, release drag
        if (eng.side && eng.moved < 8 && Math.abs(dy) > Math.abs(dx) * 1.25) {
          eng.down = false;
          ring.classList.remove('drag');
          return;
        }
        eng.moved = Math.max(eng.moved, Math.abs(dx));
        // Swiping left (dx < 0) advances forward on mobile; dragging right/left works smoothly
        eng.target = eng.side ? eng.st - dx / pull() : eng.st + dx / pull();
      }
      kick();
    };
    const onPointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('a, button')) return;
      eng.lastInteraction = performance.now();
      eng.down = true;
      eng.sx = e.clientX;
      eng.sy = e.clientY;
      eng.st = eng.target;
      eng.moved = 0;
      try {
        main.setPointerCapture(e.pointerId);
      } catch {
        // Ignore pointer capture errors on synthetic events
      }
      ring.classList.add('drag');
      kick();
    };
    const onRelease = (e: PointerEvent) => {
      if (!eng.down) return;
      eng.down = false;
      eng.lastInteraction = performance.now();
      ring.classList.remove('drag');
      if (eng.moved < 6) {
        const hit = document
          .elementsFromPoint(e.clientX, e.clientY)
          .find((x) => x.classList && x.classList.contains('m')) as HTMLElement | undefined;
        if (hit && hit.dataset.i !== undefined) {
          let d = wrapMod(Number(hit.dataset.i) - eng.target, N);
          d = Math.round(d);
          if (d > 0 && d < N) {
            eng.target = Math.round(eng.target) + d;
          }
        }
      } else {
        eng.target = Math.round(eng.target);
      }
      kick();
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      eng.lastInteraction = performance.now();
      eng.target += clampVal(e.deltaY + e.deltaX, -120, 120) / 420;
      clearTimeout(eng.wheelT);
      eng.wheelT = setTimeout(() => {
        eng.target = Math.round(eng.target);
        kick();
      }, 150);
      kick();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        eng.lastInteraction = performance.now();
        eng.target = Math.round(eng.target) + 1;
        kick();
      }
      if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        eng.lastInteraction = performance.now();
        eng.target = Math.round(eng.target) - 1;
        kick();
      }
    };

    // Smooth idle auto-glide so mobile & desktop showcase all 8 products seamlessly
    const autoTimer = !calm
      ? window.setInterval(() => {
          const now = performance.now();
          if (
            eng.inView &&
            !eng.down &&
            !eng.hovered &&
            now - eng.lastInteraction > 3400
          ) {
            eng.target = Math.round(eng.target) + 1;
            eng.dirty = true;
            kick();
          }
        }, 3600)
      : 0;

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            ([entry]) => {
              eng.inView = entry.isIntersecting;
            },
            { threshold: 0.15 }
          )
        : null;
    io?.observe(section);

    window.addEventListener('resize', size);
    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            size();
            paint();
          })
        : null;
    if (ro) {
      ro.observe(stage);
      ro.observe(rail);
    }
    stage.addEventListener('pointerenter', onPointerEnter);
    stage.addEventListener('pointerleave', onPointerLeave);
    main.addEventListener('pointermove', onPointerMove);
    main.addEventListener('pointerdown', onPointerDown);
    main.addEventListener('pointerup', onRelease);
    main.addEventListener('pointercancel', onRelease);
    stage.addEventListener('wheel', onWheel, { passive: false });
    stage.addEventListener('keydown', onKeyDown);

    size();
    paint();
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(eng.wheelT);
      if (autoTimer) clearInterval(autoTimer);
      io?.disconnect();
      window.removeEventListener('resize', size);
      ro?.disconnect();
      stage.removeEventListener('pointerenter', onPointerEnter);
      stage.removeEventListener('pointerleave', onPointerLeave);
      main.removeEventListener('pointermove', onPointerMove);
      main.removeEventListener('pointerdown', onPointerDown);
      main.removeEventListener('pointerup', onRelease);
      main.removeEventListener('pointercancel', onRelease);
      stage.removeEventListener('wheel', onWheel);
      stage.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const currentProduct = UNISEX_SERVICES[activeIndex] ?? UNISEX_SERVICES[0];
  const savedCount = Object.values(savedIds).filter(Boolean).length;

  return (
    <section
      id="services"
      ref={sectionRef}
      aria-label="Illustrative salon product concepts"
      className="vell-lookbook"
    >
      {/* Header Bar */}
      <div className="vell-header">
        <div className="vell-topbar">
          {/* Left: Eyebrow + Section Title */}
          <div className="vell-title-block">
            <div className="vell-eyebrow">
              <span>Blossom Family Salon</span>
              <span aria-hidden="true">·</span>
              <span>Hair &amp; Skin Care</span>
            </div>
            <div className="brand">
              Our <span className="brand-italic">Products.</span>
            </div>
          </div>

          {/* Center: Sleek Capsule Product Switcher */}
          <nav className="r2" aria-label="All 8 Salon Product Lines">
            {UNISEX_SERVICES.map((svc, idx) => (
              <button
                key={svc.numberLabel}
                type="button"
                onClick={(e) => {
                  jumpToService(idx);
                  e.currentTarget.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                    block: 'nearest',
                  });
                }}
                className={activeIndex === idx ? 'active-svc' : ''}
              >
                <span className="svc-num">{svc.numberLabel}</span>
                <span>{svc.shortTab}</span>
              </button>
            ))}
          </nav>

          {/* Right: saved visual concepts */}
          <div className="acct">
            <span className="vell-saved-pill" aria-label="Saved concepts">
              <svg viewBox="0 0 24 24">
                <path d="M12 20S3.5 15 3.5 9A4.6 4.6 0 0 1 12 6.6 4.6 4.6 0 0 1 20.5 9C20.5 15 12 20 12 20Z" />
              </svg>
              <b>{savedCount}</b>
            </span>
            <span className="vell-bag-pill">Concept preview</span>
          </div>
        </div>
        <p className="mx-auto max-w-[1400px] px-6 pt-3 text-[11px] leading-5 text-zinc-500 md:px-10">Illustrative product concepts for this demo. Brands, products and retail availability are to be confirmed with the salon.</p>
      </div>

      {/* Main Runway Stage + Synchronized Product Cards Rail */}
      <div className="vell-main-wrapper">
        <div ref={mainRef} className="vell-main">
        <section
          ref={stageRef}
          className="stage"
          aria-label="Illustrative product concepts. Swipe, drag, scroll or use arrow keys to browse all 8 concepts."
          tabIndex={0}
        >
          {/* Receding Runway Line of 8 Luxury Salon Product Flacons */}
          <div className="line">
            {UNISEX_SERVICES.map((svc, i) => (
              <div
                key={svc.numberLabel}
                ref={(el) => {
                  modelRefs.current[i] = el;
                }}
                className="m"
                data-i={i}
              >
                <RunwayBottleSvg productIndex={i} />
              </div>
            ))}
          </div>

          {/* Dynamic Top-Left Product Intro */}
          <div className="intro">
            <div className="intro-kicker">{currentProduct.audienceTag}</div>
            <h2 data-testid="active-service-heading">
              <span className="intro-num">{currentProduct.numberLabel}.</span>{' '}
              {currentProduct.title}
            </h2>
            <p>{currentProduct.description}</p>
          </div>

          {/* Bottom-Left Rolling Product Number & Quick Step Controls */}
          <div className="tag">
            <div className="look" aria-live="polite">
              <span>Product</span>
              <span className="win">
                <span ref={rollRef} className="roll">
                  {Array.from({ length: N + 1 }).map((_, i) => {
                    const num = (i % N) + 1;
                    return <b key={i}>{num < 10 ? `0${num}` : num}</b>;
                  })}
                </span>
              </span>
            </div>
            <div className="tag-actions">
              <button
                type="button"
                aria-label="Previous product"
                onClick={() => stepService(-1)}
                className="step-btn"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => jumpToService((activeIndex + 1) % N)}
                className="shop"
              >
                Next Product ({UNISEX_SERVICES[(activeIndex + 1) % N].shortTab}) →
              </button>
            </div>
          </div>

          {/* Interactive Pointer Ring Cursor */}
          <div ref={ringRef} className="ring" />
        </section>

        {/* Right-Hand (or Mobile Bottom) Synchronized Looping Retail Products Rail */}
        <aside ref={railRef} className="rail" aria-label="Illustrative product concepts in this line">
          {UNISEX_SERVICE_ITEMS.map((item, i) => {
            const isSaved = Boolean(savedIds[item.id]);
            return (
              <article
                key={item.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={`card${i % 2 ? ' alt' : ''}`}
              >
                <button
                  type="button"
                  className="fav"
                  aria-pressed={isSaved}
                  aria-label={`Save ${item.name}`}
                  onClick={() =>
                    setSavedIds((prev) => ({
                      ...prev,
                      [item.id]: !prev[item.id],
                    }))
                  }
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M12 20S3.5 15 3.5 9A4.6 4.6 0 0 1 12 6.6 4.6 4.6 0 0 1 20.5 9C20.5 15 12 20 12 20Z" />
                  </svg>
                </button>

                <span className="gender-tag">Concept art</span>

                <span className="shot">
                  <CardProductSvg cardIndex={i} />
                </span>

                <div className="meta">
                  <h3>{item.name}</h3>
                  <span>
                    Concept only · Details to confirm
                  </span>
                </div>
              </article>
            );
          })}
        </aside>
      </div>
    </div>
  </section>
);
};
