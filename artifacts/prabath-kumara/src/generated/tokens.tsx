/* GENERATED FROM tokens.json -- DO NOT EDIT. Run scripts/build-tokens.mjs. */
// Portable design tokens (colors as hex). Web consumes the theme via
// src/index.css; mobile (Expo) and any other platform import this object so the
// whole product shares one source of truth.
export const tokens = {
  "color": {
    "light": {
      "background": "#f1f5ec",
      "foreground": "#14221d",
      "border": "#c9d6c8",
      "card": "#fbfdf8",
      "cardForeground": "#14221d",
      "popover": "#fbfdf8",
      "popoverForeground": "#14221d",
      "primary": "#5c8f16",
      "primaryForeground": "#f8fff0",
      "secondary": "#dce9d9",
      "secondaryForeground": "#183027",
      "muted": "#e4eee2",
      "mutedForeground": "#557064",
      "accent": "#238d8a",
      "accentForeground": "#f4fffb",
      "destructive": "#c7463f",
      "destructiveForeground": "#fff7f5",
      "input": "#c9d6c8",
      "ring": "#5c8f16",
      "chart1": "#5c8f16",
      "chart2": "#238d8a",
      "chart3": "#8da83e",
      "chart4": "#315f4c",
      "chart5": "#b86b2d",
      "sidebar": "#e8f0e5",
      "sidebarForeground": "#183027",
      "sidebarBorder": "#c9d6c8",
      "sidebarPrimary": "#5c8f16",
      "sidebarPrimaryForeground": "#f8fff0",
      "sidebarAccent": "#dce9d9",
      "sidebarAccentForeground": "#183027",
      "sidebarRing": "#5c8f16"
    },
    "dark": {
      "background": "#09110f",
      "foreground": "#eff4e5",
      "border": "#28342f",
      "card": "#101815",
      "cardForeground": "#eff4e5",
      "popover": "#101815",
      "popoverForeground": "#eff4e5",
      "primary": "#c3ff47",
      "primaryForeground": "#09110f",
      "secondary": "#16352b",
      "secondaryForeground": "#d9ffc0",
      "muted": "#152421",
      "mutedForeground": "#93a299",
      "accent": "#70d8d2",
      "accentForeground": "#07100f",
      "destructive": "#ff716b",
      "destructiveForeground": "#180b0a",
      "input": "#28342f",
      "ring": "#c3ff47",
      "chart1": "#c3ff47",
      "chart2": "#70d8d2",
      "chart3": "#8eaf4b",
      "chart4": "#315f4c",
      "chart5": "#d08b4e",
      "sidebar": "#0d1b18",
      "sidebarForeground": "#eff4e5",
      "sidebarBorder": "#28342f",
      "sidebarPrimary": "#c3ff47",
      "sidebarPrimaryForeground": "#09110f",
      "sidebarAccent": "#16352b",
      "sidebarAccentForeground": "#d9ffc0",
      "sidebarRing": "#c3ff47"
    }
  },
  "fontFamily": {
    "sans": [
      "Manrope",
      "sans-serif"
    ],
    "serif": [
      "Georgia",
      "serif"
    ],
    "mono": [
      "DM Mono",
      "monospace"
    ]
  },
  "radius": "0.65rem",
  "spacing": "0.25rem"
} as const;

export type Tokens = typeof tokens;
export default tokens;
