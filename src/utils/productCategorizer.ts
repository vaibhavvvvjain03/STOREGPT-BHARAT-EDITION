// Import AI service (will use fallback if not configured)
import { generateProductDescription } from '../services/ai';

interface CategoryMap {
  [key: string]: {
    keywords: string[];
    category: string;
    colors: string[];
    searchTerm: string;
    unsplashQuery: string;
    fallbackImage: string;
  };
}

const CATEGORY_MAP: CategoryMap = {
  cafe: {
    keywords: ['chai', 'tea', 'coffee', 'chai ki dukaan', 'koffee', 'coffee shop', 'espresso', 'latte', 'cappuccino', 'filter coffee', 'tea stall'],
    category: 'Cafe',
    colors: ['#f97316', '#ea580c'],
    searchTerm: 'tea coffee beverage',
    unsplashQuery: 'chai tea coffee India',
    fallbackImage: '☕',
  },
  fashion: {
    keywords: ['saree', 'dupatta', 'kurti', 'dress', 'fabric', 'kapda', 'lehenga', 'suit', 'anarkali', 'shirt', 'clothing', 'garment', 'ethnic wear'],
    category: 'Fashion',
    colors: ['#ec4899', '#be185d'],
    searchTerm: 'saree fabric fashion',
    unsplashQuery: 'saree Indian fashion clothing',
    fallbackImage: '👗',
  },
  tech: {
    keywords: ['mobile', 'phone', 'gadget', 'charger', 'laptop', 'electronic', 'tablet', 'smartwatch', 'wireless', 'tech', 'device', 'computer'],
    category: 'Tech',
    colors: ['#06b6d4', '#0891b2'],
    searchTerm: 'gadget electronics smartphone',
    unsplashQuery: 'smartphone electronics gadget',
    fallbackImage: '📱',
  },
  grocery: {
    keywords: ['dal', 'rice', 'spice', 'namkeen', 'khana', 'chawal', 'beans', 'flour', 'oil', 'grocery', 'masala', 'vegetable', 'food'],
    category: 'Grocery',
    colors: ['#84cc16', '#65a30d'],
    searchTerm: 'grocery spices rice',
    unsplashQuery: 'grocery spices rice India',
    fallbackImage: '🌾',
  },
  jewelry: {
    keywords: ['jewelry', 'bangle', 'necklace', 'earring', 'ring', 'gold', 'silver', 'ornament', 'bracelet', 'kada', 'chain', 'pendant'],
    category: 'Jewelry',
    colors: ['#fbbf24', '#f59e0b'],
    searchTerm: 'jewelry accessories gold',
    unsplashQuery: 'jewelry gold ornaments',
    fallbackImage: '💍',
  },
  stationery: {
    keywords: ['books', 'notebook', 'pen', 'pencil', 'kitaab', 'copybook', 'stationery', 'paper', 'writing', 'school', 'office'],
    category: 'Stationery',
    colors: ['#a78bfa', '#8b5cf6'],
    searchTerm: 'books notebook stationery',
    unsplashQuery: 'books notebooks stationery',
    fallbackImage: '📚',
  },
  beauty: {
    keywords: ['makeup', 'cosmetics', 'skincare', 'sundar', 'mehendi', 'lipstick', 'foundation', 'cream', 'beauty', 'skin', 'cosmetic'],
    category: 'Beauty',
    colors: ['#fb7185', '#f43f5e'],
    searchTerm: 'makeup cosmetics beauty',
    unsplashQuery: 'makeup beauty cosmetics',
    fallbackImage: '💄',
  },
  home: {
    keywords: ['furniture', 'home', 'kitchen', 'utensil', 'ghar', 'decor', 'sofa', 'table', 'chair', 'bed', 'cushion', 'decoration'],
    category: 'Home',
    colors: ['#10b981', '#059669'],
    searchTerm: 'furniture home decor',
    unsplashQuery: 'home furniture decor',
    fallbackImage: '🏠',
  },
  sports: {
    keywords: ['sports', 'fitness', 'yoga', 'gym', 'khel', 'cricket', 'badminton', 'exercise', 'equipment', 'athlete', 'training'],
    category: 'Sports',
    colors: ['#3b82f6', '#2563eb'],
    searchTerm: 'sports fitness gym equipment',
    unsplashQuery: 'sports fitness gym equipment',
    fallbackImage: '⚽',
  },
  health: {
    keywords: ['medicine', 'health', 'pharmacy', 'tablet', 'swasth', 'ayurveda', 'supplement', 'vitamin', 'medical', 'doctor', 'wellness'],
    category: 'Health',
    colors: ['#06b6d4', '#0891b2'],
    searchTerm: 'medicine health pharmacy',
    unsplashQuery: 'medicine health pharmacy',
    fallbackImage: '💊',
  },
  toys: {
    keywords: ['toy', 'khilona', 'game', 'puzzle', 'doll', 'action figure', 'board game', 'educational'],
    category: 'Toys',
    colors: ['#f472b6', '#ec4899'],
    searchTerm: 'toys games',
    unsplashQuery: 'toys games for kids',
    fallbackImage: '🧸',
  },
  automotive: {
    keywords: ['car', 'bike', 'motorcycle', 'scooter', 'vehicle', 'automotive', 'parts', 'accessories', 'tyres', 'engine'],
    category: 'Automotive',
    colors: ['#64748b', '#475569'],
    searchTerm: 'automotive vehicle accessories',
    unsplashQuery: 'motorcycle bike car accessories',
    fallbackImage: '🏍️',
  },
};

export function categorizeInput(input: string): { 
  category: string; 
  searchTerm: string; 
  colors: string[];
  unsplashQuery: string;
  fallbackImage: string;
} {
  const lowerInput = input.toLowerCase().trim();

  for (const [, categoryData] of Object.entries(CATEGORY_MAP)) {
    for (const keyword of categoryData.keywords) {
      if (lowerInput.includes(keyword) || keyword.includes(lowerInput.split(' ')[0])) {
        return {
          category: categoryData.category,
          searchTerm: categoryData.searchTerm,
          colors: categoryData.colors,
          unsplashQuery: categoryData.unsplashQuery,
          fallbackImage: categoryData.fallbackImage,
        };
      }
    }
  }

  return {
    category: 'General',
    searchTerm: input,
    colors: ['#6366f1', '#4f46e5'],
    unsplashQuery: input,
    fallbackImage: '📦',
  };
}

// Unsplash Image Cache
const imageCache: { [key: string]: string } = {};

export async function fetchUnsplashImage(query: string, index: number = 0): Promise<string> {
  const cacheKey = `${query}-${index}`;
  
  // Return cached image if available
  if (imageCache[cacheKey]) {
    return imageCache[cacheKey];
  }

  try {
    // Using Unsplash's public API without authentication for demo
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${Math.floor(index / 10) + 1}&per_page=10&client_id=s2yxQMSWWtZMfXaYdLi8c5eWCHY2w7zXDEJSMVq5wXs`
    );
    
    if (!response.ok) throw new Error('Unsplash API failed');
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const imageUrl = data.results[index % data.results.length]?.urls?.regular || '';
      if (imageUrl) {
        imageCache[cacheKey] = imageUrl;
        return imageUrl;
      }
    }
  } catch (error) {
    console.warn('Unsplash fetch failed, using fallback:', error);
  }

  // Fallback: Use Unsplash random image URL with query
  const fallbackUrl = `https://images.unsplash.com/search?query=${encodeURIComponent(query)}&w=400&h=400&fit=crop&crop=entropy&random=${Math.random()}`;
  imageCache[cacheKey] = fallbackUrl;
  return fallbackUrl;
}

// Get category data including unsplash query
export function getCategoryData(category: string) {
  for (const [, categoryData] of Object.entries(CATEGORY_MAP)) {
    if (categoryData.category === category) {
      return categoryData;
    }
  }
  return CATEGORY_MAP.home; // Default fallback
}

interface MockProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  in_store: boolean;
  colors?: string[];
}

export async function generateMockProducts(
  category: string,
  searchTerm: string,
  count: number = 6
): Promise<MockProduct[]> {
  const products: MockProduct[] = [];
  const categoryData = getCategoryData(category);
  
  const priceRanges: { [key: string]: [number, number] } = {
    Cafe: [50, 300],
    Fashion: [500, 5000],
    Tech: [5000, 50000],
    Grocery: [50, 500],
    Jewelry: [2000, 20000],
    Stationery: [50, 500],
    Beauty: [200, 2000],
    Home: [1000, 10000],
    Sports: [500, 5000],
    Health: [100, 1000],
    Toys: [100, 2000],
    Automotive: [500, 50000],
  };

  const range = priceRanges[category] || [100, 1000];

  const productNames: { [key: string]: string[] } = {
    Cafe: ['Masala Chai', 'Filter Coffee', 'Iced Tea', 'Cappuccino', 'Chai Latte', 'Espresso'],
    Fashion: ['Cotton Saree', 'Silk Dupatta', 'Ethnic Kurti', 'Designer Lehenga', 'Casual Shirt', 'Party Dress'],
    Tech: ['Smartphone', 'USB-C Charger', 'Wireless Earbuds', 'Smart Band', 'Laptop Stand', 'Phone Case'],
    Grocery: ['Basmati Rice', 'Mixed Dal', 'Garam Masala', 'Cooking Oil', 'Atta Flour', 'Namkeen'],
    Jewelry: ['Gold Bangle', 'Pearl Necklace', 'Diamond Ring', 'Silver Earrings', 'Kada', 'Mangalsutra'],
    Stationery: ['Notebook', 'Pen Set', 'School Books', 'Art Supplies', 'Writing Pad', 'Pencil Box'],
    Beauty: ['Lipstick', 'Face Cream', 'Mehendi', 'Face Pack', 'Compact Powder', 'Eye Shadow'],
    Home: ['Wooden Table', 'Cushion Set', 'Wall Decor', 'Bed Sheet', 'Curtains', 'Lamp'],
    Sports: ['Yoga Mat', 'Dumbbells', 'Cricket Bat', 'Running Shoes', 'Water Bottle', 'Gym Gloves'],
    Health: ['Vitamin Tablets', 'Ayurvedic Oil', 'Sanitizer', 'First Aid Kit', 'Supplement', 'Face Mask'],
    Toys: ['Action Figure', 'Puzzle Set', 'Board Game', 'Doll', 'Building Blocks', 'Remote Car'],
    Automotive: ['Bike Helmet', 'Phone Mount', 'Car Air Purifier', 'Motor Oil', 'Bike Cover', 'Engine Oil'],
  };

  const names = productNames[category] || [`${category} Product`, `Premium ${category}`, `Quality ${category}`];

  for (let i = 0; i < count; i++) {
    const price = Math.floor(Math.random() * (range[1] - range[0]) + range[0]);
    const imageUrl = await fetchUnsplashImage(categoryData.unsplashQuery, i);
    
    // Try to generate AI description with timeout, fallback to default if fails (silent)
    let description = `Premium ${category.toLowerCase()} product from verified seller`;
    try {
      // Add timeout to prevent delays (2 seconds max)
      const aiDescriptionPromise = generateProductDescription(names[i % names.length], category);
      const timeoutPromise = new Promise<string>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 2000)
      );
      
      const aiDescription = await Promise.race([aiDescriptionPromise, timeoutPromise]);
      if (aiDescription && aiDescription.length > 20) {
        description = aiDescription;
      }
    } catch (error) {
      // Silent fallback - use default description (no error shown to user)
      // App continues normally
    }
    
    products.push({
      id: `product-${Date.now()}-${i}`,
      name: names[i % names.length],
      category,
      price,
      description,
      image_url: imageUrl,
      in_store: false,
      colors: categoryData.colors,
    });
  }

  return products;
}
