import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Globe, Sparkles, LogOut, BookOpen, Sun, Moon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';

interface GlassNavBarProps {
  language: string;
  onLanguageChange: (lang: string) => void;
  festivalMode: boolean;
  onFestivalConfigClick?: () => void;
  onKhataClick?: () => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'mr', name: 'मराठी' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'ur', name: 'اردو' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'অসমীয়া' },
  { code: 'kok', name: 'कोंकणी' },
  { code: 'mni', name: 'ম্যানিপুরী' },
  { code: 'mai', name: 'मैथिली' },
  { code: 'sa', name: 'संस्कृत' },
  { code: 'sat', name: 'संथाली' },
  { code: 'brx', name: 'बोडो' },
  { code: 'doi', name: 'डोगरी' },
  { code: ' kas', name: 'کشمیری' },
  { code: 'sd', name: 'سندھی' },
];

export const GlassNavBar: React.FC<GlassNavBarProps> = ({
  language,
  onLanguageChange,
  festivalMode,
  onFestivalToggle,
  onFestivalConfigClick,
  onKhataClick,
}) => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const getLangName = (code: string) => {
    return LANGUAGES.find((l) => l.code === code)?.name || 'English';
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-panel fixed top-0 left-0 right-0 z-40 px-6 py-4 mx-4 mt-4 rounded-2xl"
    >
      <div className="flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Store className="w-6 h-6 text-orange-400" />
          <span className="text-lg font-bold gradient-text">{user?.shop_name || 'StoreGPT'}</span>
        </motion.div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="glass-button px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
            >
              <Globe className="w-4 h-4" />
              {getLangName(language)}
            </motion.button>

            <AnimatePresence>
              {isLanguageOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 glass-panel rounded-xl p-2 min-w-[200px] max-h-96 overflow-y-auto z-50"
                >
                  {LANGUAGES.map((lang) => (
                    <motion.button
                      key={lang.code}
                      whileHover={{ x: 5 }}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setIsLanguageOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                        language === lang.code
                          ? 'bg-orange-500/30 dark:bg-orange-500/30 light-mode:bg-orange-200 text-orange-300 dark:text-orange-300 light-mode:text-orange-800'
                          : 'text-gray-300 dark:text-gray-300 light-mode:text-gray-700 hover:bg-white/10 dark:hover:bg-white/10 light-mode:hover:bg-orange-100/50'
                      }`}
                    >
                      {lang.name}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onKhataClick}
            className="glass-button px-4 py-2 rounded-lg flex items-center gap-2 text-sm text-gray-300 dark:text-gray-300 light-mode:text-gray-700 hover:text-indigo-300 dark:hover:text-indigo-300 light-mode:hover:text-indigo-600"
          >
            <BookOpen className="w-4 h-4" />
            Khata
          </motion.button>

          {/* Festival Mode Toggle with Indicator */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative group"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onFestivalConfigClick}
              className={`glass-button px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-all relative overflow-hidden ${
                festivalMode
                  ? 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border border-yellow-500/50'
                  : 'hover:bg-white/10'
              }`}
            >
              {/* Animated background pulse when active */}
              {festivalMode && (
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-red-400/20 rounded-lg"
                />
              )}

              {/* Icon with animation */}
              <motion.div
                animate={
                  festivalMode
                    ? { rotate: [0, 360], scale: [1, 1.2, 1] }
                    : { rotate: 0, scale: 1 }
                }
                transition={
                  festivalMode
                    ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                    : {}
                }
              >
                <Sparkles className={`w-4 h-4 ${festivalMode ? 'text-yellow-300 dark:text-yellow-300 light-mode:text-yellow-600' : 'text-gray-400 dark:text-gray-400 light-mode:text-gray-600'}`} />
              </motion.div>

              <span className={`relative z-10 ${festivalMode ? 'text-yellow-200 dark:text-yellow-200 light-mode:text-yellow-700 font-semibold' : 'text-gray-300 dark:text-gray-300 light-mode:text-gray-700'}`}>
                Festival
              </span>

              {/* Status indicator dot */}
              {festivalMode && (
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-yellow-400 relative z-10"
                />
              )}
            </motion.button>

            {/* Floating Sparkles around button when active */}
            {festivalMode && (
              <>
                <motion.div
                  animate={{ y: [0, -10, 0], x: [-15, -20, -15] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute -left-3 -top-2 w-1.5 h-1.5 bg-yellow-400 rounded-full"
                  style={{ boxShadow: '0 0 6px #FCD34D' }}
                />
                <motion.div
                  animate={{ y: [0, 10, 0], x: [15, 20, 15] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
                  className="absolute -right-3 -bottom-2 w-1.5 h-1.5 bg-orange-400 rounded-full"
                  style={{ boxShadow: '0 0 6px #FF9933' }}
                />
                <motion.div
                  animate={{ y: [-10, 0, -10], x: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                  className="absolute -right-2 top-1/2 w-1 h-1 bg-red-400 rounded-full"
                  style={{ boxShadow: '0 0 4px #FF6B35' }}
                />
              </>
            )}
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="glass-button px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-yellow-400" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => signOut()}
            className="glass-button px-4 py-2 rounded-lg flex items-center gap-2 text-sm text-gray-300 dark:text-gray-300 light-mode:text-gray-700 hover:text-red-300 dark:hover:text-red-300 light-mode:hover:text-red-600"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};
