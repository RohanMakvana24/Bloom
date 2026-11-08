import { ArrowUpRight, MapPin } from 'lucide-react';
import { SALON_MAPS, whatsappEnquiry } from '@/lib/salon-contact';

export function SalonAbout() {
  return <section id="about" className="bg-[#fcf8fa] px-6 py-20 text-[#241b23] transition-colors duration-300 sm:px-10 lg:py-28 dark:bg-[#140b14] dark:text-white">
    <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
      <div><p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#b21c61] dark:text-[#ff77b6]">At Kotecha Circle</p><p className="mt-8 font-serif text-[clamp(4.5rem,13vw,10rem)] leading-none text-[#e60073]" aria-hidden="true">✳</p></div>
      <div>
        <h2 className="font-serif text-5xl leading-[1.04] sm:text-6xl">Your family salon <em className="font-normal text-[#b21c61] dark:text-[#ff77b6]">in Rajkot.</em></h2>
        <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-700 dark:text-zinc-300">Find Blossom Family Salon on the second floor of Karunanidhan Complex, above Fitness 5 Gym near University Road. Whether you are exploring a new look or planning a special occasion, contact us to discuss the services you need.</p>
        <div className="mt-9 flex flex-wrap gap-5 text-sm font-semibold">
          <a href={whatsappEnquiry()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border-b border-[#e60073] pb-2 hover:text-[#b21c61] dark:hover:text-[#ff77b6]">Ask us on WhatsApp <ArrowUpRight size={16} /></a>
          <a href={SALON_MAPS} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border-b border-[#241b23]/30 pb-2 hover:text-[#c32568] dark:border-white/30 dark:hover:text-[#ff77b6]"><MapPin size={16} /> Get directions</a>
        </div>
      </div>
    </div>
  </section>;
}
