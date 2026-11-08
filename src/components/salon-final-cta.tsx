import { ArrowUpRight } from 'lucide-react';
import { whatsappEnquiry } from '@/lib/salon-contact';

export function SalonFinalCta() {
  return <section id="enquire" aria-labelledby="enquire-title" className="relative overflow-hidden bg-[#4c1837] px-6 py-24 text-white sm:px-10 lg:py-32 dark:bg-[#3b1730]">
    <div className="mx-auto max-w-[1240px]">
      <div className="flex items-center justify-between gap-5 border-b border-white/25 pb-6 text-[11px] font-bold uppercase tracking-[0.24em] text-[#ffd3e7]"><span>Blossom Family Salon</span><span className="hidden sm:inline">Rajkot · Kotecha Circle</span></div>
      <div className="grid gap-12 pt-12 lg:grid-cols-[1.2fr_.8fr] lg:items-end lg:gap-20">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#ffb7d8]">Your moment starts here</p>
          <h2 id="enquire-title" className="mt-6 max-w-3xl font-serif text-[clamp(3.9rem,7vw,7.4rem)] leading-[.95] tracking-[-.035em]">Let's make <em className="font-normal text-[#ffc7e2]">space for you.</em></h2>
        </div>
        <div className="lg:pb-2">
          <p className="max-w-sm text-sm leading-7 text-[#f4d8e5]">Have a look in mind, or just a question? Tell us what you need and we'll confirm the details and availability directly.</p>
          <a href={whatsappEnquiry()} target="_blank" rel="noopener noreferrer" className="group mt-8 inline-flex min-h-14 w-full items-center justify-between gap-5 border-t border-b border-white/70 py-3 text-sm font-bold transition-colors hover:text-[#ffc7e2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:w-auto sm:min-w-[280px]">Enquire on WhatsApp <ArrowUpRight size={20} className="transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1" /></a>
        </div>
      </div>
    </div>
  </section>;
}
