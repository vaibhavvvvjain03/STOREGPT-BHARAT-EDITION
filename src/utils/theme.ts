// Indian-inspired color palette
export const themes = {
  dark: {
    // Dark theme with saffron, white, and green (Indian flag colors)
    primary: '#FF9933', // Saffron
    secondary: '#128807', // Green
    tertiary: '#1F77F3', // Navy Blue (for contrast)
    background: '#0f0f1e',
    surface: '#1a1a2e',
    accent: '#FF6B35', // Darker orange
    text: '#ffffff',
    textSecondary: '#b0b0c0',
    border: 'rgba(255, 255, 255, 0.1)',
    glass: 'rgba(255, 255, 255, 0.08)',
  },
  light: {
    // Light theme with saffron, white, and green
    primary: '#FF9933', // Saffron
    secondary: '#128807', // Green
    tertiary: '#1F77F3', // Navy Blue
    background: '#ffffff',
    surface: '#f5f5f5',
    accent: '#FF6B35', // Darker orange
    text: '#1a1a1a',
    textSecondary: '#666666',
    border: 'rgba(0, 0, 0, 0.1)',
    glass: 'rgba(255, 255, 255, 0.6)',
  },
};

export type ThemeType = 'light' | 'dark';
export type Theme = typeof themes.dark;
