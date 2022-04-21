import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "context/Auth/AuthContext";
import { ColorModeScript } from '@chakra-ui/react'
import theme from "./../theme"


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <AuthProvider>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;
