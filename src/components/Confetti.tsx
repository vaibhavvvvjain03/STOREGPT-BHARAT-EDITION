import React from 'react';
import { motion } from 'framer-motion';

interface ConfettiProps {
  active?: boolean;
}

export const Confetti: React.FC<ConfettiProps> = ({ active = true }) => {
  // 🎉 emojis coming from both sides
  const partyEmojis = Array.from({ length: 8 }, (_, i) => ({
    id: `emoji-${i}`,
    side: i % 2 === 0 ? 'left' : 'right',
    delay: i * 0.2,
    y: Math.random() * 100,
  }));

  // Paper pieces falling down
  const paperPieces = Array.from({ length: 50 }, (_, i) => ({
    id: `paper-${i}`,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1.5,
    rotation: Math.random() * 360,
    color: ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#f97316', '#8b5cf6'][Math.floor(Math.random() * 7)],
    size: 8 + Math.random() * 12,
  }));

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[60]">
      {/* 🎉 Emojis coming from both sides */}
      {partyEmojis.map((emoji) => (
        <motion.div
          key={emoji.id}
          initial={{
            x: emoji.side === 'left' ? -100 : window.innerWidth + 100,
            y: emoji.y + '%',
            scale: 0,
            rotate: -180,
          }}
          animate={{
            x: emoji.side === 'left' 
              ? window.innerWidth / 2 - 50 
              : window.innerWidth / 2 + 50,
            y: emoji.y + '%',
            scale: [0, 1.5, 1],
            rotate: 0,
          }}
          exit={{
            x: emoji.side === 'left' 
              ? window.innerWidth + 100 
              : -100,
            scale: 0,
            rotate: 180,
          }}
          transition={{
            duration: 1.5,
            delay: emoji.delay,
            ease: 'easeOut',
          }}
          className="absolute text-6xl"
          style={{
            filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))',
          }}
        >
          🎉
        </motion.div>
      ))}

      {/* Paper pieces falling down */}
      {paperPieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            opacity: 1,
            x: piece.left + '%',
            y: -30,
            rotate: 0,
          }}
          animate={{
            opacity: [1, 1, 0],
            x: (piece.left + (Math.random() - 0.5) * 30) + '%',
            y: window.innerHeight + 50,
            rotate: piece.rotation + 360,
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeIn',
          }}
          className="absolute"
          style={{
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
            boxShadow: `0 0 ${piece.size}px ${piece.color}`,
          }}
        />
      ))}
    </div>
  );
};
