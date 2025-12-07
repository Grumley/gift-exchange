import { motion } from 'framer-motion';
import { characterList } from '@/assets/characters';

interface FestiveParadeProps {
    className?: string;
}

export function FestiveParade({ className = '' }: FestiveParadeProps) {
    return (
        <div className={`w-full overflow-hidden pointer-events-none ${className}`}>
            <div className="flex items-end justify-between px-4 sm:px-8 pb-4 opacity-40">
                {characterList.slice(0, 4).map((char, i) => (
                    <motion.img
                        key={i}
                        src={char}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            delay: i * 0.2,
                            duration: 0.8,
                            repeat: Infinity,
                            repeatType: "reverse",
                            repeatDelay: 5
                        }}
                        className="h-16 sm:h-24 w-auto object-contain"
                    />
                ))}
            </div>
        </div>
    );
}
