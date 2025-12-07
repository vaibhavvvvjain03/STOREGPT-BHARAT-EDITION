import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Plus, Star, Edit2, Save, X, Upload, Volume1 } from 'lucide-react';
import { translate } from '../utils/translations';
import { Product } from '../types';
import { analyzeProductImage } from '../services/ai';

interface ProductCardProps {
  product: Product;
  onAddToStore?: (product: Product) => void;
  onUpdate?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  isEditable?: boolean;
  language?: string;
}

// Language code mapping for speech synthesis
const getLanguageCode = (lang: string): string => {
  const languageMap: { [key: string]: string } = {
    en: 'en-US',
    hi: 'hi-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    bn: 'bn-IN',
    pa: 'pa-IN',
    mr: 'mr-IN',
    gu: 'gu-IN',
    or: 'or-IN',
  };
  return languageMap[lang] || 'en-US';
};


export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToStore, 
  onUpdate,
  onDelete,
  isEditable = false,
  language = 'en',
}) => {
  const [audioPlayingType, setAudioPlayingType] = useState<'name' | 'full' | null>(null);
  const [rating] = useState(Math.floor(Math.random() * 2) + 4);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(product.name);
  const [editedPrice, setEditedPrice] = useState(product.price);
  const [editedImage, setEditedImage] = useState(product.image_url);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlayAudio = (type: 'name' | 'full') => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn('Speech synthesis not supported.');
      return;
    }
    window.speechSynthesis.cancel();
    setAudioPlayingType(type);

    let textToSpeak = editedName;
    
    if (type === 'full') {
      const priceText = translate('Price', language);
      const rupeesText = translate('Rupees', language);
      textToSpeak = `${editedName}, ${priceText}, ${rupeesText} ${editedPrice}`;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = getLanguageCode(language);
    utterance.rate = speed;
    utterance.volume = volume;
    
    utterance.onend = () => {
      setAudioPlayingType(null);
    };
    
    utterance.onerror = () => {
      setAudioPlayingType(null);
    };

    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageData = reader.result as string;
        setEditedImage(imageData);
        
        // Try AI image analysis (silent fallback if fails - no disruption)
        try {
          await analyzeProductImage(imageData);
          // AI suggestions available but don't auto-fill to avoid disrupting user flow
          // Could show suggestions in a tooltip or optional "Use AI suggestions" button
        } catch (error) {
          // Silent fallback - user can continue normally
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedProduct = {
      ...product,
      name: editedName,
      price: editedPrice,
      image_url: editedImage,
    };
    if (onUpdate) {
      onUpdate(updatedProduct);
    }
    setIsEditing(false);
  };

  const imageSrc = editedImage && editedImage.startsWith('data:')
    ? editedImage
    : editedImage
    ? `${editedImage.replace('?', '?q=80&w=400&')}`
    : 'https://images.unsplash.com/?placeholder&w=400';

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 120, damping: 30 }}
      className="product-card-3d group h-full"
    >
      <div className="product-card-3d-inner glass-panel p-5 rounded-2xl overflow-hidden hover-glow h-full flex flex-col bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl border border-white/10">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 flex-1 flex flex-col"
            >
              <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center group/upload cursor-pointer ring-1 ring-orange-500/30 hover:ring-orange-500/60 transition-all">
                <img
                  src={imageSrc}
                  alt={editedName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/?products&w=400';
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover/upload:opacity-100 transition-opacity"
                >
                  <Upload className="w-6 h-6 text-white" />
                </motion.button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 mb-1 block font-semibold">{translate('Product Name', language)}</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-orange-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 mb-1 block font-semibold">Price (₹)</label>
                <input
                  type="number"
                  value={editedPrice}
                  onChange={(e) => setEditedPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-orange-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
                />
              </div>

              <div className="flex gap-2 mt-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="flex-1 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20"
                >
                  <Save className="w-4 h-4" />
                  {translate('Save', language)}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsEditing(false);
                    setEditedName(product.name);
                    setEditedPrice(product.price);
                    setEditedImage(product.image_url);
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/20"
                >
                  <X className="w-4 h-4" />
                  {translate('Cancel', language)}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full"
            >
              {/* Product Image with Audio Controls */}
              <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center group ring-1 ring-orange-500/20 hover:ring-orange-500/40 transition-all">
                <img
                  src={imageSrc}
                  alt={editedName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/?products&w=400';
                  }}
                />


                {/* Sound Button - Play name & price */}
                <motion.button
                  whileHover={{ scale: 1.10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePlayAudio('full')}
                  className={`absolute bottom-3 right-3 p-3 rounded-full backdrop-blur-md transition-all ${
                    audioPlayingType === 'full'
                      ? 'bg-green-500/60 shadow-lg shadow-green-500/50'
                      : 'bg-black/30 hover:bg-black/50 group-hover:bg-green-500/40'
                  }`}
                  title="Play name & price"
                >
                  <Volume2 className={`w-5 h-5 ${audioPlayingType === 'full' ? 'text-green-100 animate-pulse' : 'text-white'}`} />
                </motion.button>

                {isEditable && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsEditing(true)}
                      className="absolute top-3 left-3 p-3 rounded-full bg-black/30 hover:bg-blue-500/40 backdrop-blur-md transition-all"
                      title={translate('Edit product', language)}
                    >
                      <Edit2 className="w-5 h-5 text-white" />
                    </motion.button>
                    {onDelete && (
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          if (window.confirm(`Delete ${editedName}?`)) {
                            onDelete(product.id);
                          }
                        }}
                        className="absolute top-3 right-3 p-3 rounded-full bg-black/30 hover:bg-red-500/40 backdrop-blur-md transition-all"
                        title={translate('Delete product', language)}
                      >
                        <X className="w-5 h-5 text-white" />
                      </motion.button>
                    )}
                  </>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-3 mb-4 flex-1">
                <h3 className="font-bold text-lg text-white line-clamp-1 group-hover:text-orange-300 transition-colors">{editedName}</h3>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-3xl font-bold text-orange-400">
                    ₹{editedPrice.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {product.description && (
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{product.description}</p>
                )}
              </div>

              {/* Audio Controls - Volume and Speed */}
              <div className="space-y-3 mb-4 pb-4 border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                  <Volume1 className="w-4 h-4 text-orange-400" />
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-orange-500"
                    title="Speech speed"
                  />
                  <span className="text-xs text-gray-400 w-8 text-right">{speed.toFixed(1)}x</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-green-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-green-500"
                    title="Volume"
                  />
                  <span className="text-xs text-gray-400 w-8 text-right">{Math.round(volume * 100)}%</span>
                </div>
              </div>

              {/* Add to Store Button */}
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(249, 115, 22, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAddToStore?.({...product, name: editedName, price: editedPrice, image_url: editedImage})}
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 hover:shadow-lg transition-all active:shadow-md"
              >
                <Plus className="w-4 h-4" />
                {translate('Add to Store', language)}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}