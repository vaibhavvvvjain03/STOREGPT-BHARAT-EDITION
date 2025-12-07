import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface GlassPreviewFrameProps {
  children?: React.ReactNode;
  onLaunch?: () => void;
  canLaunch?: boolean;
  productCount?: number;
}

export const GlassPreviewFrame: React.FC<GlassPreviewFrameProps> = ({ 
  children, 
  onLaunch, 
  canLaunch = false,
  productCount = 0 
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const x = (e.clientY - rect.top - centerY) / 10;
    const y = (e.clientX - rect.left - centerX) / 10;

    setRotation({ x, y });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full flex items-center justify-center perspective"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 60 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="w-full max-w-2xl"
      >
        <div className="glass-plane-inner p-8 min-h-96 rounded-3xl">
          <div className="space-y-4">
            <div className="aspect-video bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center border border-white/10">
              {children || (
                <div className="text-center">
                  <p className="text-gray-400">Product Preview</p>
                  <p className="text-xs text-gray-500 mt-2">Move mouse to tilt frame</p>
                </div>
              )}
            </div>

            <motion.button
              whileHover={canLaunch ? { scale: 1.05 } : {}}
              whileTap={canLaunch ? { scale: 0.95 } : {}}
              onClick={canLaunch ? onLaunch : undefined}
              disabled={!canLaunch}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                canLaunch
                  ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:shadow-lg hover:shadow-orange-500/50 cursor-pointer'
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 opacity-50 cursor-not-allowed'
              }`}
            >
              {canLaunch ? `Launch Store (${productCount} products)` : 'Add products to launch store'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
