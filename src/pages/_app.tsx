import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { GlobalStyles } from "@/styles/GlobalStyles";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <GlobalStyles />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
