const faqs = [
  { question: 'Where is Blossom Family Salon?', answer: 'We are at Kotecha Circle in Rajkot, on the second floor of Karunanidhan Complex above Fitness 5 Gym, near University Road.' },
  { question: 'How does a WhatsApp enquiry work?', answer: 'Send your name, service of interest and preferred date or time. The salon will reply to confirm details and availability. Sending an enquiry does not reserve an appointment.' },
  { question: 'Which services can I ask about?', answer: 'You can enquire about hair, beauty, skin care, nail art, makeup and grooming. The salon can confirm its current service menu and what is right for you.' },
  { question: 'Where can I check prices and opening hours?', answer: 'Please call or WhatsApp the salon for current prices, opening hours and appointment availability.' },
];

export function SalonFaq() {
  return <section id="faq" aria-labelledby="faq-title" className="bg-[#fbf7f9] px-6 py-24 text-[#2b2029] sm:px-10 lg:py-32 dark:bg-[#19121a] dark:text-[#f8f1f5]">
    <div className="mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
      <div>
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-[#a92764] dark:text-[#ff91c5]"><span className="h-px w-10 bg-current" /> Good to know</p>
        <h2 id="faq-title" className="mt-10 max-w-md font-serif text-[clamp(3.35rem,5.8vw,5.8rem)] leading-[.98] tracking-[-.025em]">Before you <em className="font-normal text-[#af245f] dark:text-[#ff91c5]">visit.</em></h2>
        <p className="mt-7 max-w-xs text-sm leading-7 text-[#6e5967] dark:text-[#d1b9c8]">The essentials, answered simply. Our team is a message away if you need more detail.</p>
      </div>
      <div className="border-t border-[#d8c5d0] dark:border-[#57414e]">
        {faqs.map((faq, index) => <details key={faq.question} className="group border-b border-[#d8c5d0] dark:border-[#57414e]">
          <summary className="flex min-h-[86px] cursor-pointer list-none items-center gap-5 py-5 text-left marker:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#af245f] [&::-webkit-details-marker]:hidden">
            <span className="w-6 shrink-0 self-start pt-1 text-[11px] font-bold tracking-wider text-[#af245f] dark:text-[#ff91c5]">0{index + 1}</span>
            <span className="flex-1 font-serif text-[1.55rem] font-semibold leading-tight sm:text-[1.8rem]">{faq.question}</span>
            <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#c9a8ba] text-xl font-light leading-none text-[#af245f] transition-transform duration-200 group-open:rotate-45 dark:border-[#82566d] dark:text-[#ff91c5]">+</span>
          </summary>
          <p className="max-w-[600px] pb-8 pl-11 pr-8 text-sm leading-7 text-[#6e5967] dark:text-[#d1b9c8]">{faq.answer}</p>
        </details>)}
      </div>
    </div>
  </section>;
}
