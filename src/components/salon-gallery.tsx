import DragLoopCarousel from '@/components/mfa/DragLoopCarousel';

const galleryImages = [
  { src: '/images/hero-women.jpg', width: 300, lift: 18 },
  { src: '/images/services/haircut.png', width: 262, lift: 90 },
  { src: '/images/hero-men.jpg', width: 310, lift: 0 },
  { src: '/images/services/hair-color.png', width: 270, lift: 108 },
  { src: '/images/hero-kids.jpg', width: 294, lift: 30 },
  { src: '/images/services/makeup.png', width: 270, lift: 120 },
  { src: '/images/services/nails.png', width: 278, lift: 44 },
  { src: '/images/services/facial.png', width: 276, lift: 118 },
  { src: '/images/services/grooming.png', width: 280, lift: 36 },
];

export function SalonGallery() {
  return <section id="gallery" aria-labelledby="gallery-title" className="overflow-hidden bg-[#f8f2f5] py-20 text-[#241b23] transition-colors duration-300 sm:py-24 dark:bg-[#080709] dark:text-white">
    <div className="mx-auto flex max-w-[1360px] flex-col gap-6 px-6 sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:px-12">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#b21c61] dark:text-[#ff6caf]">Illustrative gallery</p>
        <h2 id="gallery-title" className="mt-3 font-serif text-5xl leading-none sm:text-6xl">Our <em className="font-normal text-[#b21c61] dark:text-[#ff6caf]">Work.</em></h2>
      </div>
      <p className="max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400">These are placeholder visuals for the demo, not photos of Blossom clients or completed work. Real salon photos can replace them once provided.</p>
    </div>
    <div className="mt-10 h-[370px] touch-pan-y sm:h-[520px]" aria-label="Drag to explore illustrative gallery images">
      <DragLoopCarousel images={galleryImages} speed={180} gap={18} minScale={0.5} radius={14} background="transparent" />
    </div>
    <p className="mx-auto mt-3 max-w-[1360px] px-6 text-[11px] uppercase tracking-[0.18em] text-zinc-600 sm:px-10 lg:px-12 dark:text-zinc-400">Drag or swipe to explore</p>
  </section>;
}
