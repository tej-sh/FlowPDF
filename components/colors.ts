// colors.ts
// Centralized color palette for light and dark themes

export const lightColors = {
  background: '#eaeaea',
  cardBackground: '#f5f5f5',
  text: '#111',
  textSecondary: '#666',
  textTertiary: '#aaa',
  accent: '#111',
  border: '#e0e0e0',
  modalBackground: '#ffffff',
  inputBackground: '#f0f0f0',
  buttonBackground: '#111',
  buttonText: '#fff',
  icon: '#888',
  iconSecondary: '#aaa',
  fileName: '#666',
  fileNameActive: '#444',
};

export const darkColors = {
  background: '#18191A',
  cardBackground: '#232526',
  text: '#F5F6FA',
  textSecondary: '#B0B3B8',
  textTertiary: '#888',
  accent: '#F5F6FA',
  border: '#333',
  modalBackground: '#232526',
  inputBackground: '#232526',
  buttonBackground: '#F5F6FA',
  buttonText: '#18191A',
  icon: '#B0B3B8',
  iconSecondary: '#888',
  fileName: '#B0B3B8',
  fileNameActive: '#F5F6FA',
};

export type ThemeColors = typeof lightColors;

export const getColors = (theme: 'light' | 'dark'): ThemeColors =>
  theme === 'dark' ? darkColors : lightColors;
