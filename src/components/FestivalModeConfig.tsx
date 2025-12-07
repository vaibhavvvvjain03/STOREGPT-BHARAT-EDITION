import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw } from 'lucide-react';

interface Festival {
  id: string;
  name: string;
  date: string;
  emoji: string;
  colors: string[];
}

const FESTIVALS: Festival[] = [
  {
    id: 'diwali',
    name: 'Diwali (दिवाली)',
    date: '11-01',
    emoji: '🎆',
    colors: ['#FF9933', '#FCD34D', '#FF6B35'],
  },
  {
    id: 'holi',
    name: 'Holi (होली)',
    date: '03-25',
    emoji: '🌈',
    colors: ['#FF1493', '#00FF00', '#FFD700'],
  },
  {
    id: 'navratri',
    name: 'Navratri (नवरात्रि)',
    date: '10-15',
    emoji: '🎭',
    colors: ['#E74C3C', '#F39C12', '#8E44AD'],
  },
  {
    id: 'rakhi',
    name: 'Rakhi (राखी)',
    date: '08-30',
    emoji: '🎀',
    colors: ['#E91E63', '#2196F3', '#FFEB3B'],
  },
  {
    id: 'independence',
    name: 'Independence Day',
    date: '08-15',
    emoji: '🇮🇳',
    colors: ['#FF9933', '#FFFFFF', '#138808'],
  },
  {
    id: 'pongal',
    name: 'Pongal (பொங்கல்)',
    date: '01-14',
    emoji: '🍚',
    colors: ['#FF9933', '#E8D700', '#2ECC71'],
  },
  {
    id: 'eid',
    name: 'Eid (عيد)',
    date: '04-11',
    emoji: '🌙',
    colors: ['#2ECC71', '#FFD700', '#E74C3C'],
  },
  {
    id: 'new-year',
    name: 'New Year',
    date: '01-01',
    emoji: '🎉',
    colors: ['#FFD700', '#FF69B4', '#00BFFF'],
  },
];

interface FestivalModeConfigProps {
  isOpen: boolean;
  onClose: () => void;
  festivalMode: boolean;
  onFestivalToggle: (enabled: boolean, festivalId?: string) => void;
}

export const FestivalModeConfig: React.FC<FestivalModeConfigProps> = ({
  isOpen,
  onClose,
  festivalMode,
  onFestivalToggle,
}) => {
  const [autoDetect, setAutoDetect] = useState(true);
  const [selectedFestival, setSelectedFestival] = useState<string | null>(null);
  const [currentFestival, setCurrentFestival] = useState<Festival | null>(null);

  useEffect(() => {
    if (autoDetect) {
      const today = new Date();
      // const monthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      const upcoming = FESTIVALS.find((f) => {
        const [month, day] = f.date.split('-');
        const festivalDate = new Date(today.getFullYear(), parseInt(month) - 1, parseInt(day));
        const timeDiff = festivalDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysDiff >= -1 && daysDiff <= 15;
      });

      if (upcoming) {
        setCurrentFestival(upcoming);
      }
    }
  }, [autoDetect]);

  const handleSelectFestival = (festivalId: string) => {
    setSelectedFestival(festivalId);
    setAutoDetect(false);
    onFestivalToggle(true, festivalId);
  };

  const handleToggleFestival = (enabled: boolean) => {
    onFestivalToggle(enabled, selectedFestival || undefined);
  };

  const handleAutoDetect = () => {
    setAutoDetect(true);
    if (currentFestival) {
      onFestivalToggle(true, currentFestival.id);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-panel rounded-2xl p-6 max-w-2xl w-full relative z-50 max-h-96 overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              Festival Mode
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-2xl font-light"
            >
              ×
            </button>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleToggleFestival(!festivalMode)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                festivalMode
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-lg shadow-orange-500/50'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {festivalMode ? '✨ Festival Mode ON' : 'Festival Mode OFF'}
            </motion.button>
          </div>

          {currentFestival && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currentFestival.emoji}</span>
                  <div>
                    <p className="font-semibold text-yellow-300">{currentFestival.name}</p>
                    <p className="text-sm text-gray-400">Upcoming on {currentFestival.date}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAutoDetect}
                  className="px-4 py-2 bg-yellow-500/30 hover:bg-yellow-500/50 text-yellow-200 rounded-lg transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Auto-Select
                </motion.button>
              </div>
            </motion.div>
          )}

          <div className="space-y-2">
            <p className="text-sm text-gray-400 mb-4">Choose a festival or auto-detect:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FESTIVALS.map((festival) => (
                <motion.button
                  key={festival.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectFestival(festival.id)}
                  className={`p-4 rounded-lg transition-all text-left ${
                    selectedFestival === festival.id
                      ? 'bg-gradient-to-r from-yellow-500/40 to-orange-500/40 border-2 border-yellow-500/60'
                      : autoDetect && currentFestival?.id === festival.id
                      ? 'bg-yellow-500/20 border border-yellow-500/40'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{festival.emoji}</span>
                      <div>
                        <p className="font-semibold text-white">{festival.name}</p>
                        <p className="text-xs text-gray-400">{festival.date}</p>
                      </div>
                    </div>
                    {selectedFestival === festival.id && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-yellow-400"
                      />
                    )}
                  </div>

                  <div className="flex gap-2 mt-2">
                    {festival.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color, opacity: 0.7 }}
                      />
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <p className="text-sm text-blue-300">
              💡 <strong>Pro Tip:</strong> Festival Mode enables beautiful animations, sparkles, and rangoli patterns.
              Auto-detect will activate the appropriate festival theme based on today's date!
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full mt-6 px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all"
          >
            Done
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};