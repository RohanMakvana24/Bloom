import { ArrowUp, ArrowUpRight, Copy, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import LogoIcon from '@/assets/logo/logo-icon';
import { SALON_ADDRESS, SALON_MAPS, SALON_PHONE, SALON_TEL, whatsappEnquiry } from '@/lib/salon-contact';

export function SalonFooter() {
  const [copied, setCopied] = useState(false);
  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(SALON_ADDRESS);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch { /* Clipboard may be unavailable outside secure contexts. */ }
  };

  return <footer id="footer" className="relative overflow-hidden bg-white text-zinc-900 dark:bg-[#09060d] dark:text-zinc-100">
    <div className="mx-auto max-w-[1360px] px-6 pt-16 pb-10 sm:px-10 lg:px-12 lg:pt-20">
      <div className="grid gap-12 border-b border-zinc-200 pb-14 lg:grid-cols-[1.2fr_1fr] dark:border-zinc-800">
        <div>
          <LogoIcon variant="obsidian" className="block h-7 w-auto dark:hidden" />
          <LogoIcon variant="light" className="hidden h-7 w-auto dark:block" />
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e60073]">BLOSSOM FAMILY SALON · RAJKOT</p>
          <h2 className="mt-3 max-w-xl font-serif text-4xl font-semibold leading-tight sm:text-5xl">A little care, <em className="font-normal text-[#e60073]">close to home.</em></h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-zinc-600 dark:text-zinc-400">Visit us at Kotecha Circle for hair, beauty, nail art, makeup and grooming. Contact the salon to ask about services and availability.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={whatsappEnquiry()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#e60073] px-5 text-sm font-semibold text-white hover:bg-[#c90065]">Enquire on WhatsApp <ArrowUpRight size={16} /></a>
            <a href={SALON_TEL} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-300 px-5 text-sm font-semibold dark:border-zinc-700">Call the salon <Phone size={15} /></a>
          </div>
        </div>
        <div className="lg:pl-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e60073]">Find us</p>
          <h3 className="mt-3 font-serif text-3xl font-semibold">Kotecha Circle, Rajkot</h3>
          <p className="mt-5 flex items-start gap-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400"><MapPin className="mt-1 shrink-0 text-[#e60073]" size={18} />{SALON_ADDRESS}</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <a href={SALON_MAPS} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-[#e60073] hover:underline">Get directions <ArrowUpRight size={15} /></a>
            <button type="button" onClick={copyAddress} className="inline-flex items-center gap-1 hover:text-[#e60073]"><Copy size={15} />{copied ? 'Copied' : 'Copy address'}</button>
          </div>
          <a href={SALON_TEL} className="mt-7 inline-flex items-center gap-2 text-base font-semibold hover:text-[#e60073]"><Phone size={17} className="text-[#e60073]" />{SALON_PHONE}</a>
          <nav aria-label="Footer navigation" className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-zinc-200 pt-6 text-sm dark:border-zinc-800">
            <a href="#home" className="hover:text-[#e60073]">Home</a>
            <a href="#our-services" className="hover:text-[#e60073]">Services</a>
            <a href="#gallery" className="hover:text-[#e60073]">Gallery</a>
            <a href="#services" className="hover:text-[#e60073]">Products</a>
            <a href="#about" className="hover:text-[#e60073]">About</a>
            <a href="#reviews" className="hover:text-[#e60073]">Stories</a>
            <a href="#visit" className="hover:text-[#e60073]">Visit</a>
            <a href="#faq" className="hover:text-[#e60073]">FAQ</a>
          </nav>
        </div>
      </div>
      <div className="my-6 text-center font-serif text-[clamp(2.5rem,9vw,8rem)] font-semibold leading-none tracking-[-0.04em] text-[#1d072c] dark:text-zinc-100">BLOSSOM</div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-6 text-[11px] uppercase tracking-wider text-zinc-500 dark:border-zinc-800">
        <span>© {new Date().getFullYear()} Blossom Family Salon · Rajkot</span>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center gap-2 hover:text-[#e60073]">Back to top <ArrowUp size={14} /></button>
      </div>
    </div>
  </footer>;
}
