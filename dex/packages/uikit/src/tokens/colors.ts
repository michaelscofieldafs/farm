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
  ...lightColorsV2,
  blue10: "#ECF6FE",
  blue20: "#C3E5FC",
  blue60: "#2882CC",
  secondary: "#7645D9",
  secondary10: "#F6F4FB",
  secondary20: "#E8E2EE",
  secondary60: "756595",
  secondary80: "#7645D980",
  background: "#FAF9FA",
  backgroundDisabled: "#E9EAEB",
  backgroundAlt: "#FFFFFF",
  backgroundAlt2: "rgba(255, 255, 255, 0.7)",
  backgroundAlt3: "rgba(255, 255, 255, 0.5)",
  backgroundHover: "rgba(0, 0, 0, 0.02)",
  backgroundTapped: "rgba(0, 0, 0, 0.04)",
  backgroundOverlay: "rgba(40, 13, 95, 0.60)",
  backgroundBubblegum: "linear-gradient(139.73deg, #E5FDFF 0%, #F3EFFF 100%)",
  backgroundPage: "#FAF9FA",
  card: "#FFFFFF",
  cardSecondary: "#FAF9FA",
  cardBorder: "#E7E3EB",
  contrast: "#191326",
  dropdown: "#F6F6F6",
  dropdownDeep: "#EEEEEE",
  invertedContrast: "#FFFFFF",
  input: "#eeeaf4",
  inputSecondary: "#d7caec",
  tertiary: "#EFF4F5",
  tertiary20: "#E2EDEE",
  tertiaryPale20: "#E2EDEE",
  text: "#280D5F",
  text99: "#280D5F99",
  textDisabled: "#BDC2C4",
  textSubtle: "#7A6EAA",
  disabled: "#E9EAEB",
  primary10: "#EEFBFC",
  primary20: "#C1EDF0",
  primary60: "#02919D",
  positive10: "#EAFBF7",
  positive20: "#BCEFE2",
  positive60: "#129E7D",
  destructive10: "#FFF0F9",
  destructive20: "#FED2E8",
  destructive60: "#D14293",
  destructive: "#ED4B9E",
  warning10: "#FBF2E7",
  warning20: "#F9D9B8",
  warning60: "#AB6502",
  bubblegum: "#F3EFFF",
  gradientPrimary: "linear-gradient(228.54deg, #1FC7D4 -13.69%, #7645D9 91.33%)",
  gradientBubblegum: "linear-gradient(139.73deg, #E5FDFF 0%, #F3EFFF 100%)",
  gradientInverseBubblegum: "linear-gradient(139.73deg, #F3EFFF 0%, #E5FDFF 100%)",
  gradientCardHeader: "linear-gradient(111.68deg, #F2ECF2 0%, #E8F2F6 100%)",
  gradientBlue: "linear-gradient(180deg, #A7E8F1 0%, #94E1F2 100%)",
  gradientViolet: "linear-gradient(180deg, #E2C9FB 0%, #CDB8FA 100%)",
  gradientVioletAlt: "linear-gradient(180deg, #CBD7EF 0%, #9A9FD0 100%)",
  gradientGold: "linear-gradient(180deg, #FFD800 0%, #FDAB32 100%)",
  gradientBold: "linear-gradient(#53DEE9, #7645D9)",
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

  secondary: "#99E39E",
  secondary10: "#0C2F30",
  secondary20: "#134445",
  secondary60: "#99E39E",
  secondary80: "#99E39E80",

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
  gradientBubblegum:
  "linear-gradient(140deg, #0A2F31 0%, #071F21 100%)",

  gradientInverseBubblegum:
  "linear-gradient(140deg, #071F21 0%, #0A2F31 100%)",

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

  bubblegum: "#041F21",
}