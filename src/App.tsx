import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { translate } from './utils/translations';
import {
  SpotlightCursor,
  LoginOverlay,
  GlassPreviewFrame,
  GlassNavBar,
  DualInputCapsule,
  ProductCard,
  KhataWidget,
  AnalyticsDashboard,
  SuccessModal,
  FestivalOverlay,
  FestivalModeConfig,
  Confetti,
} from './components';
import { useAuth } from './hooks/useAuth';
import { categorizeInput, generateMockProducts } from './utils/productCategorizer';
import { Product } from './types';

// --- MAIN DASHBOARD COMPONENT ---
const DashboardContent = () => {
  const { user, updateProfile } = useAuth();
  const [language, setLanguage] = useState<string>('en');
  const [festivalMode, setFestivalMode] = useState<boolean>(user?.festival_mode_enabled || false);
  const [selectedFestival, setSelectedFestival] = useState<string>('diwali');
  const [showFestivalConfig, setShowFestivalConfig] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [showKhata, setShowKhata] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [productCount, setProductCount] = useState<number>(6);

  // Mock Data for Charts
  const mockAnalyticsData = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    visitors: Math.floor(Math.random() * 500) + 100,
    sales: Math.floor(Math.random() * 50000) + 5000,
  }));

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  const handleFestivalToggle = async (enabled: boolean, festivalId?: string) => {
    setFestivalMode(enabled);
    if (festivalId) setSelectedFestival(festivalId);
    if (user) {
      try {
        await updateProfile({ festival_mode_enabled: enabled });
      } catch (error) {
        console.error('Error updating festival mode:', error);
      }
    }
  };

  const handleProductSearch = async (text: string) => {
    setLoading(true);
    setTimeout(async () => {
      const { category, searchTerm } = categorizeInput(text);
      const mockProducts = await generateMockProducts(category, searchTerm, productCount);
      setProducts(mockProducts as Product[]);
      setLoading(false);
    }, 800);
  };

  const handleAddProductCard = () => {
    setProductCount(prev => Math.min(prev + 1, 20)); // Max 20 products
  };

  const handleDeleteProductCard = () => {
    if (productCount > 1) {
      const newCount = productCount - 1;
      setProductCount(newCount);
      // Remove last product if count decreases
      if (products.length > newCount) {
        setProducts(prev => prev.slice(0, newCount));
        // Also remove from selected products if needed
        setSelectedProducts(prev => prev.slice(0, newCount));
      }
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleAddProductToStore = (product: Product) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, { ...product, in_store: true }];
    });
  };



  const handleLaunchStore = () => {
    if (selectedProducts.length === 0) {
      return; // Don't launch if no products
    }
    setShowSuccess(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2500);
  };

  return (
    <div className="min-h-screen w-full grid-background relative overflow-hidden text-white">
      <SpotlightCursor />
      <FestivalOverlay isActive={festivalMode} festivalId={selectedFestival} />

      <GlassNavBar
        language={language}
        onLanguageChange={handleLanguageChange}
        festivalMode={festivalMode}
        onFestivalToggle={handleFestivalToggle}
        onFestivalConfigClick={() => setShowFestivalConfig(true)}
        onKhataClick={() => setShowKhata(!showKhata)}
      />

      <FestivalModeConfig
        isOpen={showFestivalConfig}
        onClose={() => setShowFestivalConfig(false)}
        festivalMode={festivalMode}
        onFestivalToggle={handleFestivalToggle}
      />

      <div className="pt-28 pb-32 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">
            {translate('Welcome', language)}, {user?.shop_name || translate('Demo Store', language)}!
          </h1>
          <p className="text-gray-400">
            {translate('Create your perfect catalog', language)}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Preview & Suggestions */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <GlassPreviewFrame 
                onLaunch={handleLaunchStore}
                canLaunch={selectedProducts.length > 0}
                productCount={selectedProducts.length}
              >
                {selectedProducts.length > 0 ? (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold text-orange-400">
                      {selectedProducts.length} Products
                    </p>
                    <p className="text-sm text-gray-400">{translate('Ready to Launch', language)}</p>
                  </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        {translate('Store Preview', language)}
                    </div>
                )}
              </GlassPreviewFrame>
            </motion.div>

            {products.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold gradient-text">{translate('Suggested Products', language)}</h2>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDeleteProductCard}
                      disabled={productCount <= 1}
                      className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      title="Remove product card"
                    >
                      -
                    </motion.button>
                    <span className="text-sm text-gray-400 px-2">{productCount}</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddProductCard}
                      disabled={productCount >= 20}
                      className="px-3 py-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      title="Add product card"
                    >
                      +
                    </motion.button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ProductCard
                        product={product}
                        onAddToStore={handleAddProductToStore}
                        onUpdate={(updatedProduct) => {
                          setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
                        }}
                        onDelete={handleDeleteProduct}
                        isEditable={true}
                        language={language}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {products.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel p-12 rounded-xl text-center"
              >
                <p className="text-gray-400 text-lg">
                  Use the search bar below to discover products for your store
                </p>
              </motion.div>
            )}
          </div>

          {/* RIGHT: Analytics */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <AnalyticsDashboard data={mockAnalyticsData} language={language} />
            </motion.div>
          </div>
        </div>
      </div>

      <DualInputCapsule
        onTextSubmit={handleProductSearch}
        onVoiceSubmit={handleProductSearch}
        isLoading={loading}
        language={language}
      />


      {/* Show KhataWidget as modal/drawer only when showKhata is true */}
      <KhataWidget isOpen={showKhata} onClose={() => setShowKhata(false)} />

      <AnimatePresence>
        {showSuccess && (
          <SuccessModal
            storeUrl="https://storegpt.app/demo"
            shopName={user?.shop_name || 'My Store'}
            onClose={() => setShowSuccess(false)}
          />
        )}
      </AnimatePresence>

      {showConfetti && <Confetti active={true} />}
    </div>
  );
};

// --- AUTH HANDLER COMPONENT ---
function AppContent() {
  const context = React.useContext(AuthContext);
  // Prevent crash if context is missing
  const { user, loading } = context || { user: null, loading: true };

  // 1. LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-spin text-4xl">⚡</div>
      </div>
    );
  }

  // 2. IF LOGGED IN -> SHOW DASHBOARD
  if (user) {
    return <DashboardContent />;
  }

  // 3. IF NOT LOGGED IN -> SHOW LOGIN
  return <LoginOverlay />;
}

// --- MAIN EXPORT ---
function AppWrapper() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default AppWrapper;