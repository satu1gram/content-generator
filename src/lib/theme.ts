/**
 * Utility to calculate optimal theme contrast based on 'Soft Editorial' design system
 */

export interface ThemeConfig {
  mode: 'light'; // Always light for this design direction
  primary: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  surface: string;
  inner: string;
  hover: string;
  border: string;
}

export function getThemeConfig(primaryHex: string, accentHex: string): ThemeConfig {
  // We keep the primary and accent colors for logic, 
  // but enforce the requested Editorial Light theme surfaces.
  
  return {
    mode: 'light',
    primary: '#F7F6F2',         // Warm off-white
    accent: '#00A896',          // Teal
    textPrimary: '#1C1C1E',     // Absolute Ink
    textSecondary: '#3D3D3D',   // Dark Slate
    textMuted: '#9B8EA0',       // Muted Editorial Grey
    surface: '#FFFFFF',         // Crisp White Card
    inner: '#F0EEE8',           // Warm Neutral Block
    hover: '#EDEBE5',           
    border: '#E8E5DF'           // Editorial Border
  };
}

export function themeToCSSVars(config: ThemeConfig) {
  return {
    '--bp-bg-page': config.primary,
    '--bp-accent': config.accent,
    '--bp-bg-surface': config.surface,
    '--bp-bg-inner': config.inner,
    '--bp-bg-hover': config.hover,
    '--bp-text-primary': config.textPrimary,
    '--bp-text-secondary': config.textSecondary,
    '--bp-text-muted': config.textMuted,
    '--bp-border': config.border,
  };
}
