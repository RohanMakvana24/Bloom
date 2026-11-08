"use client"

import React from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion, type Variants } from 'motion/react';
import { cn } from '@/lib/utils';

export const cutoutCardSurfaceClassName = 'cutout-card-surface';

export function CutoutCard({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 180, damping: 25 });
  const rotateY = useSpring(y, { stiffness: 180, damping: 25 });
  return <motion.article className={cn('cutout-card', className)}
    style={{ rotateX, rotateY, transformPerspective: 1100 }}
    onPointerMove={event => {
      if (reduceMotion || event.pointerType !== 'mouse') return;
      const box = event.currentTarget.getBoundingClientRect();
      x.set(-((event.clientY - box.top) / box.height - .5) * 8);
      y.set(((event.clientX - box.left) / box.width - .5) * 8);
    }} onPointerLeave={() => { x.set(0); y.set(0); }}>
    {children}
  </motion.article>;
}

function part(base: string) {
  return function CardPart({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn(base, className)} {...props} />;
  };
}

export const CutoutCardMedia = part('cutout-card-media');
export const CutoutCardOverlay = part('cutout-card-overlay');
export const CutoutCardInsetLabel = part('cutout-card-inset');
export const CutoutCardPin = part('cutout-card-pin');
export const CutoutCardContent = part('cutout-card-content');
export const CutoutCardFooter = part('cutout-card-footer');
export const CutoutCardAction = part('cutout-card-action');

export function CutoutCardImage({ className, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img className={cn('cutout-card-image', className)} alt={alt} loading="lazy" decoding="async" {...props} />;
}

export function CutoutCorner({ size = 24, className }: { size?: number; className?: string }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" className={className}>
    <path d="M0 0H24C10.745 0 0 10.745 0 24Z" fill="currentColor" />
  </svg>;
}

export function useCutoutContentStaggerVariants(): { container: Variants; item: Variants } {
  const reduced = useReducedMotion();
  return {
    container: { hidden: {}, show: { transition: { staggerChildren: reduced ? 0 : .08 } } },
    item: { hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 12 }, show: { opacity: 1, y: 0, transition: { duration: .4 } } },
  };
}
