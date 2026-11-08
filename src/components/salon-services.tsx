"use client"

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { whatsappEnquiry } from '@/lib/salon-contact';
import {
  CutoutCard, CutoutCardAction, CutoutCardContent, CutoutCardFooter,
  CutoutCardImage, CutoutCardInsetLabel, CutoutCardMedia, CutoutCardOverlay,
  CutoutCardPin, CutoutCorner, cutoutCardSurfaceClassName, useCutoutContentStaggerVariants,
} from '@/components/ui/cutout-card';

const services = [
  { id: 'haircut', title: 'Haircut & Styling', tag: 'FIND YOUR LOOK', audience: 'Hair for the family', description: 'Haircuts and styling for a fresh look. Ask our team about options for you or your family.', alt: 'Illustration of a hairdryer, scissors and salon comb', tone: 'rose' },
  { id: 'hair-color', title: 'Hair Colour & Care', tag: 'A NEW SHADE', audience: 'Hair colour & care', description: 'Explore hair colour and care services with our salon team.', alt: 'Illustration of hair colour tools and care products', tone: 'peach' },
  { id: 'facial', title: 'Skin & Facial Care', tag: 'TIME FOR YOU', audience: 'Skin care', description: 'Ask about skin and facial care suited to your preferences.', alt: 'Illustration of facial care products', tone: 'sage' },
  { id: 'makeup', title: 'Makeup', tag: 'FOR THE OCCASION', audience: 'Makeup', description: 'Get in touch about makeup for an event or a look you have in mind.', alt: 'Illustration of makeup tools', tone: 'lilac' },
  { id: 'nails', title: 'Nail Art & Beauty', tag: 'THE DETAILS', audience: 'Nail art', description: 'Explore nail art and beauty services at our Rajkot salon.', alt: 'Illustration of nail care products', tone: 'pink' },
  { id: 'grooming', title: 'Grooming', tag: 'LOOK YOUR WAY', audience: 'Grooming', description: 'Contact us about grooming services and current availability.', alt: 'Illustration of grooming tools', tone: 'sand' },
];

export function SalonServices() {
  const stagger = useCutoutContentStaggerVariants();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const media = window.matchMedia('(max-width: 600px)');
    let frame = 0;
    const update = () => {
      const slides = Array.from(slider.children) as HTMLElement[];
      const center = slider.scrollLeft + slider.clientWidth / 2;
      let nearest = 0;
      let smallest = Infinity;
      slides.forEach((slide, index) => {
        const distance = media.matches ? (slide.offsetLeft + slide.offsetWidth / 2 - center) / slide.offsetWidth : 0;
        slide.style.setProperty('--slide-distance', String(Math.max(-1, Math.min(1, distance))));
        if (Math.abs(distance) < smallest) { smallest = Math.abs(distance); nearest = index; }
      });
      setActiveSlide(nearest);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    slider.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => { cancelAnimationFrame(frame); slider.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);
  const goToSlide = (index: number) => {
    const slider = sliderRef.current;
    const slide = slider?.children[index] as HTMLElement | undefined;
    if (!slider || !slide) return;
    slider.scrollTo({ left: slide.offsetLeft - (slider.clientWidth - slide.offsetWidth) / 2, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  return <section id="our-services" className="salon-services" aria-labelledby="salon-services-title">
    <div className="salon-services-inner">
      <header className="salon-services-heading">
        <div><p className="salon-services-eyebrow"><span /> THE BLOSSOM EXPERIENCE</p>
          <h2 id="salon-services-title">Our <em>Services.</em></h2></div>
        <p>Hair, skin, nails, makeup and grooming.<br />Contact us for details and availability.</p>
      </header>
      <div ref={sliderRef} className="salon-services-grid" role="region" aria-label="Our services cards" tabIndex={0} onKeyDown={event => {
        if (!window.matchMedia('(max-width: 600px)').matches) return;
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); goToSlide(Math.max(0, Math.min(services.length - 1, activeSlide + (event.key === 'ArrowRight' ? 1 : -1)))); }
      }}>
        {services.map((service, index) => <div className="service-slide" key={service.id}><CutoutCard className={`${cutoutCardSurfaceClassName} service-tone-${service.tone}`}>
          <CutoutCardMedia>
            <CutoutCardOverlay />
            <CutoutCardImage src={`/images/services/${service.id}.png`} alt={service.alt} width={1024} height={1024} sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 400px" />
            <CutoutCardInsetLabel><span>{service.tag}</span><CutoutCorner size={25} className="service-label-corner-right" /><CutoutCorner size={25} className="service-label-corner-top" /></CutoutCardInsetLabel>
            <CutoutCardPin><span>0{index + 1}</span><CutoutCorner className="service-pin-corner-left" /><CutoutCorner className="service-pin-corner-bottom" /></CutoutCardPin>
          </CutoutCardMedia>
          <CutoutCardContent>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: .2 }} variants={stagger.container}>
              <motion.h3 variants={stagger.item}>{service.title}</motion.h3>
              <motion.p variants={stagger.item}>{service.description}</motion.p>
              <motion.div variants={stagger.item}><CutoutCardFooter><span>{service.audience}</span></CutoutCardFooter></motion.div>
            </motion.div>
          </CutoutCardContent>
          <CutoutCardAction><a href={whatsappEnquiry(`Hello Blossom Family Salon, I would like to enquire about ${service.title}.`)} target="_blank" rel="noopener noreferrer" aria-label={`Enquire about ${service.title} on WhatsApp`}><ArrowUpRight size={20} /></a></CutoutCardAction>
        </CutoutCard></div>)}
      </div>
      <div className="services-slider-controls">
        <button type="button" onClick={() => goToSlide(activeSlide - 1)} disabled={activeSlide === 0} aria-label="Previous service"><ArrowLeft size={17} /></button>
        <div className="services-slider-dots">{services.map((service, index) => <button type="button" key={service.id} aria-label={`Show ${service.title}`} aria-current={activeSlide === index ? 'true' : undefined} onClick={() => goToSlide(index)} />)}</div>
        <button type="button" onClick={() => goToSlide(activeSlide + 1)} disabled={activeSlide === services.length - 1} aria-label="Next service"><ArrowRight size={17} /></button>
      </div>
      <p className="salon-services-note">Not sure where to start? <a href={whatsappEnquiry()} target="_blank" rel="noopener noreferrer">Ask our team <ArrowUpRight size={14} /></a></p>
    </div>
  </section>;
}
