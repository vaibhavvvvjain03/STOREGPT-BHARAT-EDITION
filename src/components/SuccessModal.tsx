import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, Download } from 'lucide-react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { Confetti } from './Confetti';
import { StandeeGenerator } from './StandeeGenerator';

interface SuccessModalProps {
  storeUrl: string;
  shopName: string;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ storeUrl, shopName, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [showStandee, setShowStandee] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(storeUrl);
    alert('URL copied to clipboard!');
  };

  const handleDownloadQR = () => {
    try {
      // Find the SVG element from the QR code container
      const qrContainer = document.getElementById('qr-code-container');
      const qrSvg = qrContainer?.querySelector('svg');
      
      if (!qrSvg) {
        alert('QR code not found. Please try again.');
        return;
      }

      // Clone the SVG to avoid modifying the original
      const clonedSvg = qrSvg.cloneNode(true) as SVGElement;
      
      // Set explicit dimensions
      clonedSvg.setAttribute('width', '300');
      clonedSvg.setAttribute('height', '300');
      
      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      // Create an image to convert SVG to PNG
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          alert('Failed to create canvas. Please try again.');
          URL.revokeObjectURL(svgUrl);
          return;
        }
        
        // Fill background
        ctx.fillStyle = '#0f0f1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw the image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${shopName.replace(/\s+/g, '-')}-qr-code.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
          } else {
            alert('Failed to generate image. Please try again.');
          }
          URL.revokeObjectURL(svgUrl);
        }, 'image/png');
      };
      
      img.onerror = () => {
        alert('Failed to load QR code image. Please try again.');
        URL.revokeObjectURL(svgUrl);
      };
      
      img.src = svgUrl;
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Failed to download QR code. Please try again.');
    }
  };

  const shareUrl = `Check out my store: ${storeUrl}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      <Confetti active={showConfetti} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="relative bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-white/10 rounded-2xl p-8 max-w-md mx-4 space-y-6"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex justify-center"
        >
          <CheckCircle className="w-16 h-16 text-green-400" />
        </motion.div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Store Launched!</h2>
          <p className="text-gray-400">Your store is now live and ready for customers</p>
        </div>

        <div className="glass-panel p-4 rounded-lg space-y-3">
          <div className="flex justify-center" id="qr-code-container">
            <QRCode
              value={storeUrl}
              size={180}
              level="H"
              includeMargin
              fgColor="#ffffff"
              bgColor="#0f0f1e"
            />
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">Store URL:</p>
            <p className="text-sm font-mono text-orange-400 break-all">{storeUrl}</p>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyUrl}
              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Copy className="w-4 h-4" />
              Copy URL
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadQR}
              className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              Download QR
            </motion.button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const text = `${shareUrl}\n\nCheck out my online store!`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
              }}
              className="py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-all"
            >
              WhatsApp
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(storeUrl)}`);
              }}
              className="py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all"
            >
              Facebook
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareUrl)}`);
              }}
              className="py-2 bg-sky-600 hover:bg-sky-700 rounded-lg font-semibold transition-all"
            >
              Twitter
            </motion.button>
          </div>
        </div>

        <div className="mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowStandee((v) => !v)}
            className="w-full py-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-orange-500/50 transition-all mb-2"
          >
            {showStandee ? 'Hide Standee Preview' : 'Show Printable Standee'}
          </motion.button>
          {showStandee && (
            <>
              {/* Side-by-side glassy standee panel next to deploy card */}
              <div className="absolute left-full top-0 ml-8 z-[100] flex flex-col justify-center pointer-events-auto" style={{height: '100%'}}>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="bg-gray-900 rounded-2xl shadow-2xl px-8 py-6 w-[370px] border border-gray-700 flex flex-col items-center">
                    <div className="flex items-center justify-between w-full mb-4">
                      <h2 className="text-xl font-bold text-orange-300">Printable Standee</h2>
                      <button onClick={() => setShowStandee(false)} className="p-2 rounded-full hover:bg-gray-800 text-white"><span style={{fontSize:'1.5rem'}}>&times;</span></button>
                    </div>
                    <div className="flex-1 flex flex-col justify-center w-full">
                      <StandeeGenerator shopName={shopName} storeUrl={storeUrl} />
                    </div>
                  </div>
                </div>
              </div>
              {/* Backdrop for standee panel, only behind the modal */}
              <div className="fixed inset-0 z-[99] bg-black/40 backdrop-blur-sm" onClick={() => setShowStandee(false)} />
            </>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-orange-500/50 transition-all"
        >
          Close
        </motion.button>
      </motion.div>
    </div>
  );
};
