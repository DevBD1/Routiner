export const PALETTE = {
  white: '#F5F5F5',
  black: '#121712',
  olive: '#2E3829',
  sage: '#A6B5A1',
  forest: '#1F261C',
  darkGreen: '#23281e',
  lightGreen: '#EBF2E8',
  vividGreen: '#619154',
  brightGreen: '#8CD178', 
};

export default {
  light: {
    text: PALETTE.black,
    background: PALETTE.white,
    tabBar: PALETTE.white,
    tint: PALETTE.lightGreen,
    tabIconDefault: PALETTE.vividGreen,
    tabIconSelected: PALETTE.black,
    button1: PALETTE.olive,
    button2: PALETTE.brightGreen,
    checkbox: PALETTE.olive,
    box: PALETTE.white,
  },
  dark: {
    text: PALETTE.white,
    background: PALETTE.black,
    tabBar: PALETTE.forest,
    tint: PALETTE.sage,
    tabIconDefault: PALETTE.sage,
    tabIconSelected: PALETTE.white,
    button1: PALETTE.olive,
    button2: PALETTE.brightGreen,
    checkbox: PALETTE.olive,
    box: PALETTE.darkGreen,
  },
  palette: PALETTE,
};
