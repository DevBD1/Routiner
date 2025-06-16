export const PALETTE = {
  white: '#FFFFFF',
  olive: '#42523D',
  sage: '#A6B5A1',
  black: '#121712',
  forest: '#2E3829',
  darkGreen: '#1F261C',
};

export default {
  light: {
    text: PALETTE.black,
    background: PALETTE.white,
    tint: PALETTE.olive,
    tabIconDefault: PALETTE.sage,
    tabIconSelected: PALETTE.olive,
  },
  dark: {
    text: PALETTE.white,
    background: PALETTE.black,
    tint: PALETTE.sage,
    tabIconDefault: PALETTE.forest,
    tabIconSelected: PALETTE.sage,
  },
  palette: PALETTE,
};
