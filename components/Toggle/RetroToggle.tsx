import { ColorMode, Box, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import styled, { css } from "styled-components";

const YellowOutline = styled.div<{ $isDarkMode: boolean }>`
  background-color: #cfff18;
  border-radius: 16px;
  height: calc(100% - 8px);
  position: absolute;
  width: 92px;
  transition: right 300ms ease;
  z-index: 1;
  right: 4px;
  ${({ $isDarkMode }) =>
    !$isDarkMode &&
    css`
      right: 52%;
    `}
`;

export const RetroToggle = ({
  onToggle,
  colorMode,
}: {
  onToggle: () => void;
  colorMode: ColorMode;
}) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggle = () => {
    setIsDarkMode((prev) => !prev);
    onToggle();
  };

  return (
    <Stack
      alignItems="center"
      background="#0d131a"
      borderRadius="24px"
      cursor="pointer"
      direction="row"
      height="32px"
      justifyContent="space-between"
      padding={4}
      position="relative"
      width="200px"
      onClick={toggle}
    >
      <YellowOutline $isDarkMode={isDarkMode} />
      <Text
        color={!isDarkMode ? "#000000" : "#ffffff"}
        fontSize="14px"
        fontWeight="400"
        margin="0 !important"
        zIndex={2}
      >
        Light mode
      </Text>
      <Text
        color={isDarkMode ? "#000000" : "#ffffff"}
        fontSize="14px"
        fontWeight="400"
        marginRight={12}
        zIndex={2}
      >
        Dark mode
      </Text>
    </Stack>
  );
};
