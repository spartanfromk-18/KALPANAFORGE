import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface TintedCardProps {
  backgroundImageUrl: string;
  children: React.ReactNode;
}

export const TintedCard: React.FC<TintedCardProps> = ({ backgroundImageUrl, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.2 1"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className="group relative h-[400px] w-full overflow-hidden rounded-[2rem] bg-white shadow-xl transition-all hover:shadow-2xl hover:shadow-primary/10"
    >
      {/* Background Image with Parallax-ish feel */}
      <div
        className="absolute inset-0 h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      />

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-70 transition-opacity" />

      {/* Content Container - Glass Effect */}
      <div className="absolute inset-x-4 bottom-4 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-6 text-white transition-all group-hover:bg-white/20">
        {children}
      </div>
    </motion.div>
  );
};
