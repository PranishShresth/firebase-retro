// theme.ts

// 1. import `extendTheme` function
import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const fontConfig = {
  fonts: {
    heading: "Open Sans, sans-serif",
    body: "Roboto, Commissioner, Inter, sans-serif",
  },
};

// 3. extend the theme
const theme = extendTheme({
  config,
  styles: {
    global: (props: any) => ({
      body: { bg: mode("#f6f7fb", "#171923")(props) },
    }),
  },
  ...fontConfig,
});

export default theme;
