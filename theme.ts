// theme.ts

// 1. import `extendTheme` function
import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const fontConfig = {
  fonts: {
    heading: "Open Sans, sans-serif",
    body: "Inter, sans-serif",
  },
};
// 3. extend the theme
const theme = extendTheme({ config, ...fontConfig });

export default theme;
