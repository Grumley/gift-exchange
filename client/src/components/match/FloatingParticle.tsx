import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';

interface FloatingParticleProps {
  type: 'snowflake' | 'gift';
  delay: number;
  duration: number;
  startX: number;
  size: number;
  snowflakeIndex?: number;
}

const snowflakeChars = ['❄', '❅', '❆', '✻', '✼'];

export function FloatingParticle({ type, delay, duration, startX, size, snowflakeIndex = 0 }: FloatingParticleProps) {
  // Use deterministic index from parent instead of random during render
  const snowflake = useMemo(() => snowflakeChars[snowflakeIndex % snowflakeChars.length], [snowflakeIndex]);

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${startX}%` }}
      initial={{
        y: '110vh',
        opacity: 0,
        scale: 0.5,
        rotate: 0
      }}
      animate={{
        y: '-10vh',
        opacity: [0, 1, 1, 0.8, 0],
        scale: [0.5, 1, 1, 0.9, 0.8],
        rotate: [0, 90, 180, 270, 360]
      }}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
        times: [0, 0.1, 0.5, 0.8, 1]
      }}
    >
      {type === 'snowflake' ? (
        <span
          className="text-white/80 select-none"
          style={{ fontSize: size }}
        >
          {snowflake}
        </span>
      ) : (
        <Gift
          className="text-[#d4a84b]"
          style={{ width: size, height: size }}
        />
      )}
    </motion.div>
  );
}
