import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import "@fontsource/inter/400.css";
import "@fontsource/open-sans/700.css";
import ErrorBoundary from "components/ErrorBoundary";
import { AuthProvider } from "context/Auth/AuthContext";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import theme from "./../theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <ErrorBoundary fallback={<p>Something went wrong! Please try again</p>}>
        <AuthProvider>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Component {...pageProps} />
        </AuthProvider>
      </ErrorBoundary>
    </ChakraProvider>
  );
}

export default MyApp;
