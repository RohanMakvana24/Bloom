import { ArrowUpRight } from 'lucide-react';
import { whatsappEnquiry } from '@/lib/salon-contact';

export function SalonReviews() {
  return <section id="reviews" aria-labelledby="reviews-title" className="bg-[#f7f1f4] px-6 py-24 text-[#2b2029] sm:px-10 lg:py-32 dark:bg-[#1a141a] dark:text-[#f8f1f5]">
    <div className="mx-auto max-w-[1240px]">
      <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.24em] text-[#a92764] dark:text-[#ff91c5]"><span className="h-px w-10 bg-current" /> Client stories</div>
      <div className="mt-9 grid gap-12 border-t border-[#d7c7d0] pt-12 lg:grid-cols-[.88fr_1.12fr] lg:gap-20 dark:border-[#54404c]">
        <div>
          <h2 id="reviews-title" className="max-w-lg font-serif text-[clamp(3.35rem,6vw,6rem)] leading-[.98] tracking-[-.025em]">Every visit has <em className="font-normal text-[#af245f] dark:text-[#ff91c5]">a story.</em></h2>
          <p className="mt-7 max-w-sm text-sm leading-7 text-[#6e5967] dark:text-[#d1b9c8]">A space for the voices of the people who make Blossom what it is.</p>
        </div>
        <div className="flex flex-col justify-between border-l-2 border-[#b82d6b] pl-7 sm:pl-12">
          <div>
            <span aria-hidden="true" className="font-serif text-7xl leading-none text-[#b82d6b] dark:text-[#ff91c5]">✳</span>
            <p className="mt-2 max-w-xl font-serif text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.15]">A place for real experiences.</p>
            <p className="mt-7 max-w-md text-sm leading-7 text-[#6e5967] dark:text-[#d1b9c8]">We look forward to sharing genuine guest experiences here. Until then, you can ask our team anything about your visit.</p>
          </div>
          <a href={whatsappEnquiry('Hello Blossom Family Salon, I would like to know more about your services.')} target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex w-fit items-center gap-3 border-b border-[#af245f] pb-2 text-sm font-semibold text-[#9c1d55] transition-colors hover:text-[#6f123e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#af245f] dark:text-[#ffa8d0] dark:hover:text-white">Start a conversation <ArrowUpRight size={17} /></a>
        </div>
      </div>
    </div>
  </section>;
}
