import { darkColorsV2, lightColorsV2 } from "./v2Colors";

export const baseColors = {
  white: "white",
  failure: "#ED4B9E",
  failure33: "#ED4B9E33",
  primary: "#1FC7D4",
  primary0f: "#1FC7D40f",
  primary3D: "#1FC7D43D",
  primaryBright: "#53DEE9",
  primaryDark: "#0098A1",
  success: "#31D0AA",
  success19: "#31D0AA19",
  warning: "#FFB237",
  warning2D: "#ED4B9E2D",
  warning33: "#ED4B9E33",
};

export const additionalColors = {
  binance: "#F0B90B",
  overlay: "#452a7a",
  gold: "#FFC700",
  silver: "#B2B2B2",
  bronze: "#E7974D",
  yellow: "#D67E0A",
};

export const lightColors = {
  ...baseColors,
  ...additionalColors,
  ...darkColorsV2,

  /* Blues / Teal */
  blue10: "#062A2C",
  blue20: "#08393C",
  blue60: "#5FD6DA",

  /* Primary / Secondary */
  primaryDark: "#0FB9B1",
  primary10: "#0A2F31",
  primary20: "#0E4A4D",
  primary60: "#38E1D9",

  secondary: "#6BE7E3",
  secondary10: "#0C2F30",
  secondary20: "#134445",
  secondary60: "#6BE7E3",
  secondary80: "#6BE7E380",

  /* Backgrounds */
  background: "#031B1C",
  backgroundPage: "#031B1C",
  backgroundAlt: "#071F21",
  backgroundAlt2: "rgba(7, 31, 33, 0.7)",
  backgroundAlt3: "rgba(0, 0, 0, 0.25)",
  backgroundHover: "rgba(255, 255, 255, 0.04)",
  backgroundTapped: "rgba(255, 255, 255, 0.08)",
  backgroundOverlay: "rgba(6, 40, 42, 0.65)",
  backgroundDisabled: "#1E3A3C",
  backgroundBubblegum: "#041F21",

  /* Cards */
  card: "#071F21",
  cardSecondary: "#041718",
  cardBorder: "#0F3E40",

  /* Dropdowns / Inputs */
  dropdown: "#071F21",
  dropdownDeep: "#031516",
  input: "#0B2F31",
  inputSecondary: "#072526",

  /* Text */
  contrast: "#FFFFFF",
  invertedContrast: "#0B1F20",
  text: "#E6FAFA",
  text99: "#E6FAFA99",
  textSubtle: "#9FD6D4",
  textDisabled: "#5C8F8E",

  /* UI States */
  disabled: "#355E5F",
  tertiary: "#123C3E",
  tertiary20: "#1A4D4F",
  tertiaryPale20: "#1A4D4F",

  /* Status */
  positive10: "#0C3A32",
  positive20: "#0F5E52",
  positive60: "#3DE3C6",

  destructive: "#E05A7A",
  destructive10: "#3A1020",
  destructive20: "#5A1A2F",
  destructive60: "#F08AA3",

  warning10: "#3A2A10",
  warning20: "#6A4A12",
  warning60: "#F2B84B",

  /* Gradients */
  gradientPrimary:
    "linear-gradient(135deg, #0FB9B1 0%, #38E1D9 100%)",

  gradientBlue:
    "linear-gradient(180deg, #0A3F42 0%, #0FB9B1 100%)",

  gradientViolet:
    "linear-gradient(180deg, #0FB9B1 0%, #38E1D9 100%)",

  gradientVioletAlt:
    "linear-gradient(180deg, #0A2F31 0%, #0E4A4D 100%)",

  gradientGold:
    "linear-gradient(180deg, #FFD36A 0%, #F5A623 100%)",

  gradientBold:
    "linear-gradient(135deg, #38E1D9, #0FB9B1)",

  gradientCardHeader:
    "linear-gradient(160deg, #0A2F31 0%, #071F21 100%)",

  gradientBubblegum:
  "linear-gradient(140deg, #0A2F31 0%, #071F21 100%)",

  gradientInverseBubblegum:
  "linear-gradient(140deg, #071F21 0%, #0A2F31 100%)",

  bubblegum: "#041F21",
};

export const darkColors = {
  ...baseColors,
  ...additionalColors,
  ...darkColorsV2,

  /* Blues / Teal */
  blue10: "#062A2C",
  blue20: "#08393C",
  blue60: "#5FD6DA",

  /* Primary / Secondary */
  primaryDark: "#0FB9B1",
  primary10: "#0A2F31",
  primary20: "#0E4A4D",
  primary60: "#38E1D9",

  secondary: "#6BE7E3",
  secondary10: "#0C2F30",
  secondary20: "#134445",
  secondary60: "#6BE7E3",
  secondary80: "#6BE7E380",

  /* Backgrounds */
  background: "#031B1C",
  backgroundPage: "#031B1C",
  backgroundAlt: "#071F21",
  backgroundAlt2: "rgba(7, 31, 33, 0.7)",
  backgroundAlt3: "rgba(0, 0, 0, 0.25)",
  backgroundHover: "rgba(255, 255, 255, 0.04)",
  backgroundTapped: "rgba(255, 255, 255, 0.08)",
  backgroundOverlay: "rgba(6, 40, 42, 0.65)",
  backgroundDisabled: "#1E3A3C",
  backgroundBubblegum: "#041F21",

  /* Cards */
  card: "#071F21",
  cardSecondary: "#041718",
  cardBorder: "#0F3E40",

  /* Dropdowns / Inputs */
  dropdown: "#071F21",
  dropdownDeep: "#031516",
  input: "#0B2F31",
  inputSecondary: "#072526",

  /* Text */
  contrast: "#FFFFFF",
  invertedContrast: "#0B1F20",
  text: "#E6FAFA",
  text99: "#E6FAFA99",
  textSubtle: "#9FD6D4",
  textDisabled: "#5C8F8E",

  /* UI States */
  disabled: "#355E5F",
  tertiary: "#123C3E",
  tertiary20: "#1A4D4F",
  tertiaryPale20: "#1A4D4F",

  /* Status */
  positive10: "#0C3A32",
  positive20: "#0F5E52",
  positive60: "#3DE3C6",

  destructive: "#E05A7A",
  destructive10: "#3A1020",
  destructive20: "#5A1A2F",
  destructive60: "#F08AA3",

  warning10: "#3A2A10",
  warning20: "#6A4A12",
  warning60: "#F2B84B",

  /* Gradients */
  gradientPrimary:
    "linear-gradient(135deg, #0FB9B1 0%, #38E1D9 100%)",

  gradientBlue:
    "linear-gradient(180deg, #0A3F42 0%, #0FB9B1 100%)",

  gradientViolet:
    "linear-gradient(180deg, #0FB9B1 0%, #38E1D9 100%)",

  gradientVioletAlt:
    "linear-gradient(180deg, #0A2F31 0%, #0E4A4D 100%)",

  gradientGold:
    "linear-gradient(180deg, #FFD36A 0%, #F5A623 100%)",

  gradientBold:
    "linear-gradient(135deg, #38E1D9, #0FB9B1)",

  gradientCardHeader:
    "linear-gradient(160deg, #0A2F31 0%, #071F21 100%)",

  gradientBubblegum:
  "linear-gradient(140deg, #0A2F31 0%, #071F21 100%)",

  gradientInverseBubblegum:
  "linear-gradient(140deg, #071F21 0%, #0A2F31 100%)",

  bubblegum: "#041F21",
}
