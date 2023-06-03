import { useColorMode } from "@chakra-ui/react";

export const useIsDarkMode = () => {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  return isDarkMode;
};
