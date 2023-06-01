import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "context/Auth/AuthContext";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "./../theme";
import "@fontsource/inter/400.css";
import "@fontsource/open-sans/700.css";
import ErrorBoundary from "components/ErrorBoundary";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <ErrorBoundary fallback={<p>Something went wrong!</p>}>
        <AuthProvider>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Component {...pageProps} />
        </AuthProvider>
      </ErrorBoundary>
    </ChakraProvider>
  );
}

export default MyApp;
