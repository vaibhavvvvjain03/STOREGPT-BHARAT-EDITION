import React, { useMemo } from 'react';

interface FestivalTheme {
  id: string;
  name: string;
  colors: string[];
  sparkleColors: string[];
  patterns: string;
  celebration: string;
}

const FESTIVAL_THEMES: { [key: string]: FestivalTheme } = {
  diwali: {
    id: 'diwali',
    name: 'Diwali',
    colors: ['#FF9933', '#FCD34D', '#FF6B35'],
    sparkleColors: ['#FCD34D', '#FF9933', '#FF6B35'],
    patterns: 'M50,10 L61,35 L87,35 L67,52 L78,77 L50,60 L22,77 L33,52 L13,35 L39,35 Z',
    celebration: '🎆',
  },
  holi: {
    id: 'holi',
    name: 'Holi',
    colors: ['#FF1493', '#00FF00', '#FFD700'],
    sparkleColors: ['#FF1493', '#00FF00', '#FFD700'],
    patterns: 'M50,20 Q70,30 75,50 Q70,70 50,80 Q30,70 25,50 Q30,30 50,20',
    celebration: '🌈',
  },
  navratri: {
    id: 'navratri',
    name: 'Navratri',
    colors: ['#E74C3C', '#F39C12', '#8E44AD'],
    sparkleColors: ['#E74C3C', '#F39C12', '#8E44AD'],
    patterns: 'M50,10 Q60,35 50,50 Q60,65 50,90 Q40,65 50,50 Q40,35 50,10',
    celebration: '🎭',
  },
  rakhi: {
    id: 'rakhi',
    name: 'Rakhi',
    colors: ['#E91E63', '#2196F3', '#FFEB3B'],
    sparkleColors: ['#E91E63', '#2196F3', '#FFEB3B'],
    patterns: 'M50,50 Q80,50 90,80 Q80,110 50,120 Q20,110 10,80 Q20,50 50,50',
    celebration: '🎀',
  },
  independence: {
    id: 'independence',
    name: 'Independence Day',
    colors: ['#FF9933', '#FFFFFF', '#138808'],
    sparkleColors: ['#FF9933', '#FFFFFF', '#138808'],
    patterns: 'M50,10 L61,35 L87,35 L67,52 L78,77 L50,60 L22,77 L33,52 L13,35 L39,35 Z',
    celebration: '🇮🇳',
  },
  pongal: {
    id: 'pongal',
    name: 'Pongal',
    colors: ['#FF9933', '#E8D700', '#2ECC71'],
    sparkleColors: ['#FF9933', '#E8D700', '#2ECC71'],
    patterns: 'M50,30 L70,50 L50,70 L30,50 Z M50,40 L60,50 L50,60 L40,50 Z',
    celebration: '🍚',
  },
  eid: {
    id: 'eid',
    name: 'Eid',
    colors: ['#2ECC71', '#FFD700', '#E74C3C'],
    sparkleColors: ['#2ECC71', '#FFD700', '#E74C3C'],
    patterns: 'M50,20 L60,40 L80,40 L65,52 L72,72 L50,60 L28,72 L35,52 L20,40 L40,40 Z',
    celebration: '🌙',
  },
  newyear: {
    id: 'new-year',
    name: 'New Year',
    colors: ['#FFD700', '#FF69B4', '#00BFFF'],
    sparkleColors: ['#FFD700', '#FF69B4', '#00BFFF'],
    patterns: 'M50,10 L55,35 L80,35 L60,52 L65,77 L50,60 L35,77 L40,52 L20,35 L45,35 Z',
    celebration: '🎉',
  },
};

interface EnhancedFestivalOverlayProps {
  isActive: boolean;
  festivalId?: string;
}

// Rangoli Pattern Component
const RangoliPattern: React.FC<{ index: number; theme: FestivalTheme }> = ({ index, theme }) => {
  const x = Math.random() * 100;
  const y = Math.random() * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 4, delay: index * 0.3, repeat: Infinity }}
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <svg width="60" height="60" viewBox="0 0 100 100">
        <path d={theme.patterns} stroke={theme.colors[0]} strokeWidth="1.5" fill="none" opacity="0.6" />
        <circle cx="50" cy="50" r="3" fill={theme.colors[1]} />
      </svg>
    </motion.div>
  );
};

// Sparkle Component with Festival Colors
const FestivalSparkle: React.FC<{ id: number; type: 'standard' | 'burst' | 'fall'; theme: FestivalTheme }> = ({
  id,
  type,
  theme,
}) => {
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const delay = Math.random() * 2;
  const color = theme.sparkleColors[id % theme.sparkleColors.length];

  const variants = {
    standard: {
      initial: { opacity: 0, scale: 0 },
      animate: {
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        y: [0, -60],
      },
      transition: { duration: 2, delay, repeat: Infinity },
    },
    burst: {
      initial: { opacity: 0, scale: 0 },
      animate: {
        opacity: [0, 1, 0],
        scale: [1, 2, 0],
        x: Math.cos((id * 360) / 20) * 50,
        y: Math.sin((id * 360) / 20) * 50,
      },
      transition: { duration: 1.5, delay, repeat: Infinity },
    },
    fall: {
      initial: { opacity: 0, y: -100 },
      animate: {
        opacity: [0, 1, 0],
        y: 100,
        rotate: 360,
      },
      transition: { duration: 2.5, delay, repeat: Infinity },
    },
  };

  const variant = variants[type];

  return (
    <motion.div
      key={`${type}-${id}`}
      initial={variant.initial}
      animate={variant.animate}
      transition={variant.transition}
      className="absolute w-1.5 h-1.5 rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        backgroundColor: color,
        boxShadow: `0 0 10px ${color}`,
      }}
    />
  );
};

// Festival-Specific Animation Component
const FestivalCelebration: React.FC<{ theme: FestivalTheme }> = ({ theme }) => {
  return (
    <motion.div
      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl pointer-events-none"
      style={{ opacity: 0.3 }}
    >
      {theme.celebration}
    </motion.div>
  );
};

// Rotating Pattern (Festival-Specific)
const RotatingFestivalPattern: React.FC<{ theme: FestivalTheme }> = ({ theme }) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      style={{ width: '200px', height: '200px' }}
    >
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="95" stroke={theme.colors[0]} strokeWidth="1" fill="none" opacity="0.3" />

        {Array.from({ length: 8 }).map((_, i) => (
          <g key={i} transform={`rotate(${(i * 360) / 8} 100 100)`}>
            <ellipse cx="100" cy="30" rx="15" ry="25" fill="none" stroke={theme.colors[1]} strokeWidth="1" opacity="0.5" />
            <circle cx="100" cy="25" r="3" fill={theme.colors[2]} opacity="0.7" />
          </g>
        ))}

        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="100"
            y1="100"
            x2={100 + 60 * Math.cos((i * 360) / 12 * (Math.PI / 180))}
            y2={100 + 60 * Math.sin((i * 360) / 12 * (Math.PI / 180))}
            stroke={theme.colors[0]}
            strokeWidth="0.5"
            opacity="0.4"
          />
        ))}

        <circle cx="100" cy="100" r="8" fill={theme.colors[1]} opacity="0.6" />
      </svg>
    </motion.div>
  );
};

// Main Enhanced Festival Overlay
export const EnhancedFestivalOverlay: React.FC<EnhancedFestivalOverlayProps> = ({ isActive, festivalId = 'diwali' }) => {
  const theme = FESTIVAL_THEMES[festivalId] || FESTIVAL_THEMES.diwali;

  const sparkles = useMemo(() => Array.from({ length: 50 }, (_, i) => i), []);
  const rangolis = useMemo(() => Array.from({ length: 8 }, (_, i) => i), []);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {/* Background Gradient based on Festival */}
      <motion.div
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${theme.colors[0]}20, ${theme.colors[1]}10, ${theme.colors[2]}20)`,
        }}
      />

      {/* Rangoli Patterns */}
      {rangolis.map((i) => (
        <RangoliPattern key={`rangoli-${i}`} index={i} theme={theme} />
      ))}

      {/* Rotating Pattern */}
      <div className="fixed inset-0 flex items-center justify-center opacity-15">
        <RotatingFestivalPattern theme={theme} />
      </div>

      {/* Festival Celebration Emoji */}
      <FestivalCelebration theme={theme} />

      {/* Sparkles */}
      {sparkles.map((i) => (
        <React.Fragment key={`sparkles-${i}`}>
          <FestivalSparkle id={i} type="standard" theme={theme} />
          {i % 2 === 0 && <FestivalSparkle id={i} type="burst" theme={theme} />}
          {i % 3 === 0 && <FestivalSparkle id={i} type="fall" theme={theme} />}
        </React.Fragment>
      ))}

      {/* Top Festive Glow */}
      <motion.div
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${theme.colors[0]}20, transparent)`,
        }}
      />

      {/* Bottom Festive Glow */}
      <motion.div
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 3.5, repeat: Infinity }}
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${theme.colors[1]}20, transparent)`,
        }}
      />
    </div>
  );
};