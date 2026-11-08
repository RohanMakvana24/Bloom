import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  MapPin,
  PhoneCall,
  Clock,
  Check,
  X,
  Scissors,
  Calendar,
} from 'lucide-react';
import {
  SALON_PHONE,
  SALON_TEL,
  SALON_MAPS,
  whatsappEnquiry,
} from '@/lib/salon-contact';
import {
  HERO_SPOTLIGHTS,
  HeroSpotlightId,
  getHeroSpotlight,
  validateBookingInput,
} from '@/lib/salon-hero-config';

const SALON_SERVICES = [
  'Haircut & Styling',
  'Hair Colour & Care',
  'Skin & Facial Care',
  'Makeup',
  'Nail Art',
  'Grooming',
];

const QUICK_TIME_SLOTS = [
  'Today · 11:30 AM',
  'Today · 03:00 PM',
  'Today · 06:30 PM',
  'Tomorrow · 11:00 AM',
];

export const SalonHero: React.FC = () => {
  const [activeSpotlightId, setActiveSpotlightId] = useState<HeroSpotlightId>('women');
  const activeSpotlight = getHeroSpotlight(activeSpotlightId);

  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const bookingButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [clientName, setClientName] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>(SALON_SERVICES[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>(QUICK_TIME_SLOTS[0]);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedReservation, setConfirmedReservation] = useState<{
    clientName: string;
    service: string;
    slot: string;
    whatsappUrl: string;
  } | null>(null);

  const handleSelectSpotlight = (id: HeroSpotlightId) => {
    setActiveSpotlightId(id);
    const preset = getHeroSpotlight(id);
    setSelectedService(preset.defaultService);
  };

  const openBookingWithService = (serviceName?: string) => {
    setBookingError(null);
    if (serviceName) {
      setSelectedService(serviceName);
    }
    setIsBookingOpen(true);
  };

  useEffect(() => {
    if (!isBookingOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsBookingOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      bookingButtonRef.current?.focus();
    };
  }, [isBookingOpen]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateBookingInput({
      clientName,
      service: selectedService,
      timeSlot: selectedSlot,
    });
    if (!validation.valid) {
      setBookingError(validation.error ?? 'Please fill in all fields.');
      return;
    }
    setBookingError(null);
    const trimmedName = clientName.trim();
    const trimmedSlot = selectedSlot.trim();
    const whatsappUrl = whatsappEnquiry(
      `Hello Blossom Family Salon, I would like to book an appointment.\nName: ${trimmedName}\nService: ${selectedService}\nPreferred date/time: ${trimmedSlot}\nPlease confirm availability.`
    );
    setConfirmedReservation({
      clientName: trimmedName,
      service: selectedService,
      slot: trimmedSlot,
      whatsappUrl,
    });
    setIsBookingOpen(false);
  };

  return (
    <section
      id="home"
      aria-label="Blossom Family Salon Flagship Atelier in Rajkot"
      className="relative isolate overflow-hidden bg-[#faf7f5] text-zinc-950 pt-22 pb-10 sm:pt-24 sm:pb-12 lg:pt-24 lg:pb-14 dark:bg-[#0c090d] dark:text-zinc-50 border-b border-zinc-900/10 dark:border-white/10"
    >
      {/* Subtle Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-1/4 h-[480px] w-[480px] rounded-full bg-[#e60073]/[0.07] blur-[120px] dark:bg-[#ff3b9a]/[0.11]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-10 h-[360px] w-[360px] rounded-full bg-[#c32568]/[0.05] blur-[100px] dark:bg-[#e60073]/[0.08]"
      />

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        {/* Top Editorial Kicker Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900/10 pb-3.5 dark:border-white/10">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-zinc-600 dark:text-zinc-400">
            <span className="inline-block h-2 w-2 rounded-full bg-[#e60073] dark:bg-[#ff3b9a]" />
            <span className="text-[#e60073] dark:text-[#ff3b9a]">BLOSSOM UNISEX &amp; FAMILY SALON</span>
            <span aria-hidden="true">·</span>
            <span>KOTECHA CIRCLE, RAJKOT</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#e60073] dark:text-[#ff3b9a]" />
              <span>Open Daily · 10:00 AM – 09:00 PM</span>
            </span>
            <span aria-hidden="true">·</span>
            <a
              href={SALON_TEL}
              className="inline-flex items-center gap-1.5 font-medium text-zinc-900 hover:text-[#e60073] dark:text-zinc-200 dark:hover:text-[#ff3b9a] transition-colors"
            >
              <PhoneCall className="h-3.5 w-3.5 text-[#e60073] dark:text-[#ff3b9a]" />
              <span className="tabular-nums">{SALON_PHONE}</span>
            </a>
          </div>
        </div>

        {/* Main 12-Column Editorial Split */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:mt-8 lg:grid-cols-12 lg:items-center lg:gap-10">
          {/* Left Column: Editorial Typography, Interactive Look Switcher & CTAs */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-between">
            {/* Interactive Department Segmented Control */}
            <div className="mb-5">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                Select Atelier Experience
              </p>
              <div
                role="tablist"
                aria-label="Salon department spotlight"
                className="flex w-full sm:w-auto sm:inline-flex items-center gap-1 overflow-x-auto rounded-xl border border-zinc-900/10 bg-zinc-900/[0.03] p-1 [scrollbar-width:none] dark:border-white/10 dark:bg-white/[0.04]"
              >
                {HERO_SPOTLIGHTS.map((item) => {
                  const isSelected = item.id === activeSpotlight.id;
                  return (
                    <button
                      key={item.id}
                      role="tab"
                      type="button"
                      aria-selected={isSelected}
                      onClick={() => handleSelectSpotlight(item.id)}
                      className={`inline-flex shrink-0 items-center gap-1.5 sm:gap-2 rounded-lg px-3 sm:px-3.5 py-2 text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-950 text-white shadow-sm dark:bg-[#e60073] dark:text-white'
                          : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white'
                      }`}
                    >
                      <span
                        className={`text-[10px] tabular-nums ${
                          isSelected
                            ? 'text-[#ff7cbb] dark:text-white/90'
                            : 'text-zinc-400 dark:text-zinc-500'
                        }`}
                      >
                        {item.index}
                      </span>
                      <span>{item.tabLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Editorial Headline */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c32568] dark:text-[#ff6caf]">
                {activeSpotlight.kicker}
              </p>

              <h1
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                className="mt-3 text-[clamp(2.9rem,5.6vw,5.25rem)] font-medium leading-[0.94] tracking-[-0.03em] text-zinc-950 dark:text-white"
              >
                {activeSpotlight.headline}{' '}
                <em className="font-normal italic text-[#e60073] dark:text-[#ff5aa8]">
                  {activeSpotlight.accentWord}
                </em>
              </h1>

              <p className="mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                {activeSpotlight.description}
              </p>
            </div>

            {/* Curated Service Highlights & Starting Tariff */}
            <div className="mt-7 border-y border-zinc-900/10 py-4 dark:border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {activeSpotlight.highlights.map((item, idx) => (
                    <React.Fragment key={item}>
                      {idx > 0 && (
                        <span aria-hidden="true" className="text-zinc-400 dark:text-zinc-600">
                          ·
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5">
                        <Scissors className="h-3 w-3 text-[#e60073] dark:text-[#ff3b9a]" />
                        {item}
                      </span>
                    </React.Fragment>
                  ))}
                </div>

                <div className="flex items-baseline gap-2 text-xs">
                  <span className="uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Starts at
                  </span>
                  <strong className="text-base font-bold tabular-nums text-zinc-950 dark:text-white">
                    {activeSpotlight.startingPrice}
                  </strong>
                  <span aria-hidden="true" className="text-zinc-400">
                    ·
                  </span>
                  <span className="tabular-nums text-zinc-500 dark:text-zinc-400">
                    {activeSpotlight.duration}
                  </span>
                </div>
              </div>
            </div>

            {/* Primary & Secondary Action Row */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <button
                ref={bookingButtonRef}
                type="button"
                onClick={() => openBookingWithService(activeSpotlight.defaultService)}
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-zinc-950 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#e60073] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60073] dark:bg-[#e60073] dark:hover:bg-[#d10068] cursor-pointer"
              >
                <Calendar className="h-4 w-4" />
                <span>Book {activeSpotlight.defaultService}</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>

              <a
                href="#our-services"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-900/15 bg-white/80 px-5 py-3.5 text-xs sm:text-sm font-semibold text-zinc-900 transition-colors hover:border-[#e60073] hover:text-[#e60073] dark:border-white/15 dark:bg-white/[0.04] dark:text-zinc-100 dark:hover:border-[#ff3b9a] dark:hover:text-[#ff3b9a]"
              >
                <span>Explore Full Menu</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href={SALON_MAPS}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2 py-2 text-xs font-medium text-zinc-600 underline decoration-zinc-400 underline-offset-4 hover:text-[#e60073] dark:text-zinc-400 dark:hover:text-[#ff3b9a]"
              >
                <MapPin className="h-3.5 w-3.5 text-[#e60073] dark:text-[#ff3b9a]" />
                <span>Above Fitness 5 Gym, Kotecha Cir</span>
              </a>
            </div>

            {/* Live Confirmation Banner when user submits the booking dialog */}
            {confirmedReservation && (
              <div
                role="status"
                aria-live="polite"
                className="mt-6 rounded-xl border border-[#e60073]/30 bg-[#e60073]/[0.06] p-4 text-xs sm:text-sm text-zinc-900 dark:border-[#ff3b9a]/30 dark:bg-[#ff3b9a]/[0.08] dark:text-zinc-100"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e60073] text-white">
                      <Check className="h-3 w-3" />
                    </span>
                    <div>
                      <p className="font-semibold">
                        Request ready for {confirmedReservation.clientName} —{' '}
                        <span className="text-[#e60073] dark:text-[#ff6caf]">
                          {confirmedReservation.service}
                        </span>
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-300">
                        Preferred slot: <span className="tabular-nums font-medium">{confirmedReservation.slot}</span> · Kotecha Circle Studio
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={confirmedReservation.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#e60073] dark:bg-white dark:text-zinc-950 dark:hover:bg-[#ff3b9a] dark:hover:text-white transition-colors"
                    >
                      <span>Send via WhatsApp</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setConfirmedReservation(null)}
                      aria-label="Dismiss reservation confirmation"
                      className="text-xs text-zinc-500 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Asymmetric Editorial Portrait Gallery */}
          <div className="lg:col-span-6 xl:col-span-6 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch">
              {/* Dominant Primary Portrait */}
              <figure className="sm:col-span-7 min-w-0 relative overflow-hidden rounded-2xl border border-zinc-900/10 bg-zinc-200 dark:border-white/10 dark:bg-zinc-900 h-[360px] sm:h-[460px] lg:h-[480px]">
                <img
                  src={activeSpotlight.image}
                  alt={activeSpotlight.imageAlt}
                  fetchPriority="high"
                  width={900}
                  height={1125}
                  className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ff7cbb]">
                    <span>{activeSpotlight.index}</span>
                    <span aria-hidden="true">/</span>
                    <span>{activeSpotlight.tabLabel}</span>
                  </div>
                  <p
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    className="mt-1 text-2xl sm:text-3xl font-medium leading-tight"
                  >
                    {activeSpotlight.defaultService}
                  </p>
                  <p className="mt-1 text-[11px] text-white/80">
                    Kotecha Circle Flagship · Senior Stylist Consultation
                  </p>
                </figcaption>
              </figure>

              {/* Right Companion Stack: Secondary Portrait + Architectural Studio Card */}
              <div className="sm:col-span-5 min-w-0 flex flex-col gap-4 sm:h-[460px] lg:h-[480px]">
                <figure className="relative flex-1 min-h-[190px] overflow-hidden rounded-2xl border border-zinc-900/10 bg-zinc-200 dark:border-white/10 dark:bg-zinc-900">
                  <img
                    src={activeSpotlight.secondaryImage}
                    alt={activeSpotlight.secondaryAlt}
                    width={600}
                    height={750}
                    className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75">
                      ALL GENERATIONS
                    </p>
                    <p
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                      className="mt-0.5 text-lg sm:text-xl font-medium leading-snug"
                    >
                      {activeSpotlight.secondaryCaption}
                    </p>
                  </figcaption>
                </figure>

                {/* Studio Quick-Pass Card */}
                <div className="shrink-0 rounded-2xl border border-zinc-900/10 bg-white p-4 sm:p-5 dark:border-white/10 dark:bg-[#151018]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e60073] dark:text-[#ff5aa8]">
                      RAJKOT STUDIO
                    </span>
                    <span className="text-[11px] font-medium tabular-nums text-zinc-500 dark:text-zinc-400">
                      2nd Floor
                    </span>
                  </div>
                  <p
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    className="mt-1.5 text-xl font-semibold leading-tight text-zinc-950 dark:text-white"
                  >
                    Walk-ins &amp; Express Bookings
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                    Karunanidhan Complex, above Fitness 5 Gym, Kotecha Circle.
                  </p>
                  <div className="mt-3.5 pt-3 border-t border-zinc-900/10 dark:border-white/10 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => openBookingWithService(activeSpotlight.defaultService)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#e60073] hover:underline dark:text-[#ff5aa8] cursor-pointer"
                    >
                      <span>Reserve Chair</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                    <a
                      href="#services"
                      className="text-[11px] font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      Care Lookbook →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Architectural Ledger Strip */}
        <div className="mt-8 lg:mt-10 border-t border-zinc-900/10 pt-5 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              01 · ATELIER SCOPE
            </p>
            <p
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              className="mt-1 text-xl sm:text-2xl font-semibold text-zinc-950 dark:text-white"
            >
              Hair, Skin, Nails &amp; Bridal
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              02 · TRANSPARENT MENU
            </p>
            <p
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              className="mt-1 text-xl sm:text-2xl font-semibold tabular-nums text-zinc-950 dark:text-white"
            >
              Services Starting ₹149
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              03 · FORMULATIONS
            </p>
            <p
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              className="mt-1 text-xl sm:text-2xl font-semibold text-zinc-950 dark:text-white"
            >
              24K Keratin &amp; Botanical Care
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              04 · LOCATION
            </p>
            <p
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              className="mt-1 text-xl sm:text-2xl font-semibold text-zinc-950 dark:text-white"
            >
              Kotecha Circle, Rajkot
            </p>
          </div>
        </div>
      </div>

      {/* WhatsApp & Instant Studio Appointment Modal */}
      {isBookingOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-dialog-title"
          className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white text-zinc-950 p-6 shadow-2xl space-y-5 dark:border-zinc-800 dark:bg-[#141017] dark:text-zinc-50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e60073] dark:text-[#ff5aa8]">
                  BLOSSOM FAMILY SALON · RAJKOT
                </p>
                <h2
                  id="booking-dialog-title"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  className="mt-1 text-2xl font-semibold"
                >
                  Reserve Your Salon Session
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Choose your service and preferred time. We will confirm your chair right away.
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsBookingOpen(false)}
                aria-label="Close booking dialog"
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="client-name-input"
                  className="block text-xs font-medium text-zinc-800 dark:text-zinc-200 mb-1.5"
                >
                  Client Full Name
                </label>
                <input
                  id="client-name-input"
                  type="text"
                  value={clientName}
                  onChange={(e) => {
                    setClientName(e.target.value);
                    if (bookingError) setBookingError(null);
                  }}
                  placeholder="e.g. Aaravsinh Jadeja"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#e60073] dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="salon-service-select"
                  className="block text-xs font-medium text-zinc-800 dark:text-zinc-200 mb-1.5"
                >
                  Service of Interest
                </label>
                <select
                  id="salon-service-select"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-[#e60073] dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                >
                  {SALON_SERVICES.map((svc) => (
                    <option key={svc} value={svc}>
                      {svc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="preferred-time-input"
                  className="block text-xs font-medium text-zinc-800 dark:text-zinc-200 mb-1.5"
                >
                  Preferred Date &amp; Time
                </label>
                <input
                  id="preferred-time-input"
                  type="text"
                  value={selectedSlot}
                  onChange={(event) => {
                    setSelectedSlot(event.target.value);
                    if (bookingError) setBookingError(null);
                  }}
                  placeholder="e.g. Saturday 4:30 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#e60073] dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {QUICK_TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setSelectedSlot(slot);
                        if (bookingError) setBookingError(null);
                      }}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                        selectedSlot === slot
                          ? 'bg-[#e60073] text-white'
                          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {bookingError && (
                <p role="alert" className="text-xs font-medium text-red-500">
                  {bookingError}
                </p>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-300 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#e60073] text-white text-xs font-semibold hover:bg-[#c30062] transition-colors cursor-pointer"
                >
                  Confirm &amp; Prepare Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
