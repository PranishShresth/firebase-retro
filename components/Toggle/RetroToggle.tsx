import { ColorMode, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import styled, { css } from "styled-components";
import { useMediaQuery } from "@chakra-ui/react";

const YellowOutline = styled.div<{ $isDarkMode: boolean; $isMobile: boolean }>`
  background-color: #cfff18;
  border-radius: 16px;
  height: calc(100% - 8px);
  position: absolute;
  width: ${({ $isMobile }) => ($isMobile ? "53px" : "92px")};
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
  const isDarkMode = colorMode === "dark";
  const bg = useColorModeValue("#f2f2f2", "#0D131A");
  const iconBg = useColorModeValue("#1C2A3A", "#DADADA");
  const borderBg = useColorModeValue("#DADADA", "#1C2A3A");
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [isXsSize] = useMediaQuery("(max-width: 324px)");

  if (isXsSize) return null;

  return (
    <Stack
      alignItems="center"
      background={bg}
      border={`1px solid ${borderBg}`}
      borderRadius="24px"
      cursor="pointer"
      direction="row"
      height="32px"
      justifyContent="space-between"
      padding={4}
      position="relative"
      width={[121, null, 200]}
      onClick={onToggle}
    >
      <YellowOutline $isDarkMode={isDarkMode} $isMobile={isMobile} />
      <Text
        color={!isDarkMode ? "#000000" : iconBg}
        fontSize="14px"
        fontWeight="400"
        margin="0 !important"
        zIndex={2}
      >
        {isMobile ? "Light" : "Light Mode"}
      </Text>
      <Text
        color={isDarkMode ? "#000000" : iconBg}
        fontSize="14px"
        fontWeight="400"
        marginRight={12}
        zIndex={2}
      >
        {isMobile ? "Dark" : "Dark Mode"}
      </Text>
    </Stack>
  );
};
