import React, { useState } from 'react';
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Copy,
  Layers,
  LocateFixed,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Plus,
  Minus,
} from 'lucide-react';
import {
  SALON_ADDRESS,
  SALON_MAPS,
  SALON_NAME,
  SALON_PHONE,
  SALON_TEL,
  whatsappEnquiry,
} from '@/lib/salon-contact';
import {
  VISIT_LANDMARKS,
  STUDIO_VISIT_FACTS,
  VisitLandmarkId,
  MapStyleMode,
  getVisitLandmark,
  getNextVisitLandmark,
  buildGoogleMapsEmbedUrl,
  clampMapZoom,
  formatCoordinatesLabel,
} from '@/lib/salon-visit-config';

export function SalonVisit() {
  const [activeLandmarkId, setActiveLandmarkId] = useState<VisitLandmarkId>('salon-flagship');
  const [mapMode, setMapMode] = useState<MapStyleMode>('road');
  const [customZoom, setCustomZoom] = useState<number | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  const activeLandmark = getVisitLandmark(activeLandmarkId);
  const effectiveZoom = clampMapZoom(customZoom ?? activeLandmark.zoom);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(SALON_ADDRESS);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* Clipboard access may be restricted in non-HTTPS contexts */
    }
  };

  const handleSelectLandmark = (id: VisitLandmarkId) => {
    setActiveLandmarkId(id);
    setCustomZoom(undefined);
  };

  const handleStepLandmark = (direction: 1 | -1) => {
    const next = getNextVisitLandmark(activeLandmarkId, direction);
    handleSelectLandmark(next.id);
  };

  const handleZoom = (delta: number) => {
    setCustomZoom((prev) => clampMapZoom((prev ?? activeLandmark.zoom) + delta));
  };

  const handleResetToSalon = () => {
    setActiveLandmarkId('salon-flagship');
    setCustomZoom(undefined);
  };

  const googleEmbedUrl = buildGoogleMapsEmbedUrl(activeLandmark, mapMode, effectiveZoom);

  return (
    <section
      id="visit"
      aria-labelledby="visit-title"
      className="relative overflow-hidden bg-[#faf7f5] text-zinc-950 py-20 sm:py-24 lg:py-28 dark:bg-[#0c090d] dark:text-zinc-50 border-t border-zinc-900/10 dark:border-white/10"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {/* Top Editorial Header Row */}
        <div className="flex flex-col gap-6 pb-10 lg:flex-row lg:items-end lg:justify-between lg:pb-12 border-b border-zinc-900/10 dark:border-white/10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-600 dark:text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-[#e60073]" />
              <span>FIND BLOSSOM · RAJKOT STUDIO MAP &amp; ROUTE GUIDE</span>
            </div>
            <h2
              id="visit-title"
              className="mt-4 font-serif text-[clamp(2.5rem,4.8vw,4.35rem)] font-medium leading-[0.98] tracking-[-0.03em] text-zinc-950 dark:text-white"
            >
              Right here at{' '}
              <em className="font-normal italic text-[#c32568] dark:text-[#ff5aa5]">
                Kotecha Circle, Rajkot.
              </em>
            </h2>
            <p className="mt-4 max-w-xl text-sm sm:text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
              Explore our live Rajkot studio map. Select any nearby landmark below to focus the map across Kotecha Circle, University Road, and our flagship studio above Fitness 5 Gym.
            </p>
          </div>

          {/* Quick Concierge Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={SALON_MAPS}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2.5 rounded-lg bg-[#1c141d] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#e60073] dark:bg-[#e60073] dark:hover:bg-[#ff2a8e]"
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>Open in Google Maps</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>

            <button
              type="button"
              onClick={handleCopyAddress}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-900/15 bg-white/80 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-800 transition hover:border-[#e60073] hover:text-[#e60073] dark:border-white/15 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:border-[#ff5aa5] dark:hover:text-[#ff5aa5] cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Address Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-[#e60073] dark:text-[#ff5aa5]" />
                  <span>Copy Address</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main 12-Column Interactive Map & Route Studio Grid */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 items-stretch">
          {/* Left Column (5 cols): Interactive Waypoints & Studio Concierge */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6 min-w-0">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                  RAJKOT ROUTE WAYPOINTS (04)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleStepLandmark(-1)}
                    aria-label="Previous map landmark"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-900/15 bg-white text-zinc-800 transition hover:border-[#e60073] hover:text-[#e60073] dark:border-white/15 dark:bg-white/[0.04] dark:text-zinc-200 cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStepLandmark(1)}
                    aria-label="Next map landmark"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-900/15 bg-white text-zinc-800 transition hover:border-[#e60073] hover:text-[#e60073] dark:border-white/15 dark:bg-white/[0.04] dark:text-zinc-200 cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Waypoint Cards */}
              <div className="space-y-3" role="tablist" aria-label="Rajkot studio map waypoints">
                {VISIT_LANDMARKS.map((landmark) => {
                  const isSelected = landmark.id === activeLandmarkId;
                  return (
                    <button
                      key={landmark.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => handleSelectLandmark(landmark.id)}
                      className={`group w-full text-left rounded-xl p-4 sm:p-5 transition-all border cursor-pointer ${
                        isSelected
                          ? 'border-[#e60073]/50 bg-white shadow-[0_14px_34px_-16px_rgba(230,0,115,0.22)] dark:border-[#ff5aa5]/60 dark:bg-[#19121c]'
                          : 'border-zinc-900/10 bg-white/55 hover:border-zinc-900/25 hover:bg-white dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-white/25 dark:hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-bold ${
                              isSelected
                                ? 'bg-[#e60073] text-white'
                                : 'bg-zinc-900/8 text-zinc-600 dark:bg-white/10 dark:text-zinc-300'
                            }`}
                          >
                            {landmark.indexLabel}
                          </span>
                          <div>
                            <h3 className="font-serif text-xl sm:text-2xl font-semibold leading-tight text-zinc-950 dark:text-white">
                              {landmark.title}
                            </h3>
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                              {landmark.subtitle} · {landmark.travelTime}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold uppercase tracking-[0.16em] shrink-0 ${
                            isSelected
                              ? 'text-[#c32568] dark:text-[#ff5aa5]'
                              : 'text-zinc-400 dark:text-zinc-500'
                          }`}
                        >
                          {landmark.badge}
                        </span>
                      </div>

                      {isSelected && (
                        <p className="mt-3 pt-3 border-t border-zinc-900/8 dark:border-white/10 text-xs sm:text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                          {landmark.description}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Studio Address & Direct Contact Card */}
            <div className="rounded-2xl border border-zinc-900/10 bg-white p-5 sm:p-6 dark:border-white/10 dark:bg-[#151018]">
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-zinc-900/10 dark:border-white/10">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c32568] dark:text-[#ff5aa5]">
                    OFFICIAL STUDIO ADDRESS
                  </p>
                  <p className="mt-1 font-serif text-xl font-semibold text-zinc-950 dark:text-white">
                    {SALON_NAME}
                  </p>
                </div>
                <MapPin className="h-5 w-5 shrink-0 text-[#e60073] dark:text-[#ff5aa5]" />
              </div>

              <address className="mt-4 not-italic text-xs sm:text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {SALON_ADDRESS} — <strong className="font-semibold text-zinc-950 dark:text-white">360007</strong>
              </address>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-900/10 dark:border-white/10">
                {STUDIO_VISIT_FACTS.map((fact) => (
                  <div key={fact.label} className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
                      {fact.label}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {fact.value}
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                      {fact.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 pt-4 border-t border-zinc-900/10 dark:border-white/10">
                <a
                  href={SALON_TEL}
                  className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-900/15 px-3.5 py-2 text-xs font-semibold text-zinc-900 transition hover:border-[#e60073] hover:text-[#e60073] dark:border-white/15 dark:text-zinc-100 dark:hover:border-[#ff5aa5] dark:hover:text-[#ff5aa5]"
                >
                  <Phone className="h-3.5 w-3.5 text-[#e60073] dark:text-[#ff5aa5]" />
                  <span>{SALON_PHONE}</span>
                </a>
                <a
                  href={whatsappEnquiry(
                    'Hello Blossom Family Salon, please share your exact location pin and current appointment availability at Kotecha Circle.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#e60073] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#c80064]"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>WhatsApp Desk</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Dedicated Architectural Real Map Frame */}
          <div className="lg:col-span-7 min-w-0 flex flex-col">
            <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-900/15 bg-white shadow-[0_24px_60px_-24px_rgba(24,14,24,0.22)] dark:border-white/15 dark:bg-[#151018]">
              {/* Top Dedicated Map Control Header Bar (Never overlaps Google Maps place card) */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-900/10 bg-zinc-950 px-4 py-3 text-white dark:border-white/10">
                <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-200">
                  <Compass className="h-3.5 w-3.5 text-[#ff5aa5]" />
                  <span className="font-mono tracking-wider">
                    {formatCoordinatesLabel(activeLandmark.coordinates)}
                  </span>
                  <span className="text-white/30">·</span>
                  <span className="text-white font-semibold truncate max-w-[180px] sm:max-w-none">
                    {activeLandmark.title}
                  </span>
                </div>

                {/* Map Layer & Zoom Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <div
                    role="group"
                    aria-label="Map view style"
                    className="inline-flex items-center gap-1 rounded-lg bg-white/8 p-1 text-[11px] font-semibold text-zinc-300 border border-white/10"
                  >
                    <button
                      type="button"
                      onClick={() => setMapMode('road')}
                      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 transition cursor-pointer ${
                        mapMode === 'road'
                          ? 'bg-[#e60073] text-white'
                          : 'hover:text-white'
                      }`}
                    >
                      <Layers className="h-3 w-3" />
                      <span>Road Map</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapMode('satellite')}
                      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 transition cursor-pointer ${
                        mapMode === 'satellite'
                          ? 'bg-[#e60073] text-white'
                          : 'hover:text-white'
                      }`}
                    >
                      <span>Satellite</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapMode('dark-atelier')}
                      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 transition cursor-pointer ${
                        mapMode === 'dark-atelier'
                          ? 'bg-[#e60073] text-white'
                          : 'hover:text-white'
                      }`}
                    >
                      <span>Dark Map</span>
                    </button>
                  </div>

                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleZoom(1)}
                      aria-label="Zoom in map"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/8 text-white border border-white/10 transition hover:bg-[#e60073] cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleZoom(-1)}
                      aria-label="Zoom out map"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/8 text-white border border-white/10 transition hover:bg-[#e60073] cursor-pointer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleResetToSalon}
                      aria-label="Reset map to Blossom Family Salon"
                      title="Reset to Blossom Family Salon"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/8 text-[#ff5aa5] border border-white/10 transition hover:bg-[#e60073] hover:text-white cursor-pointer"
                    >
                      <LocateFixed className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Real Interactive Google Map Viewport */}
              <div className="relative flex-1 min-h-[390px] sm:min-h-[450px] lg:min-h-[480px] w-full bg-[#1a131c]">
                <iframe
                  key={googleEmbedUrl}
                  title={`Live Google Map for ${activeLandmark.title} in Rajkot`}
                  src={googleEmbedUrl}
                  className={`h-full w-full min-h-[390px] sm:min-h-[450px] lg:min-h-[480px] border-0 transition-all duration-300 ${
                    mapMode === 'dark-atelier'
                      ? 'invert-[92%] hue-rotate-180 contrast-[96%] saturate-[85%]'
                      : ''
                  }`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Bottom Dedicated Active Landmark & Route Footer Bar */}
              <div className="border-t border-zinc-900/10 bg-zinc-950 p-4 sm:p-5 text-white dark:border-white/10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5aa5]">
                      <span>STOP {activeLandmark.indexLabel} / 04</span>
                      <span>·</span>
                      <span>{activeLandmark.badge}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1 text-emerald-400">
                        <Clock className="h-3 w-3" /> Open Today · 10 AM – 9 PM
                      </span>
                    </div>
                    <h3 className="mt-1 font-serif text-2xl sm:text-3xl font-medium leading-tight text-white">
                      {activeLandmark.title}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-300 line-clamp-2">
                      {activeLandmark.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStepLandmark(1)}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/20 cursor-pointer"
                    >
                      <span>Next Stop</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                    <a
                      href={SALON_MAPS}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-[#e60073] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#ff2a8e]"
                    >
                      <span>Get Directions</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
