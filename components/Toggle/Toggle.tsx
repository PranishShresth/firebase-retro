import { ColorMode, Box } from "@chakra-ui/react";
import styled from "styled-components";
const ToggleContainer = styled(Box)`
  font-size: 1rem;
  width: 4em;
  height: 1.8em;
  border-radius: 4.5em;
  padding: 0.125em;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s linear;
`;

const Switch = styled.div<{ colorMode: ColorMode }>`
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
  background-color: ${({ colorMode }) =>
        colorMode === "light" ? "#FBBD08" : "white"};
  position: relative;
  transform: ${({ colorMode }) =>
        colorMode === "light" ? "translateX(0)" : "translateX(2.2em)"};
  transition: inherit;
`;

export const DarkModeToggle = ({ onToggle, colorMode }: { onToggle: () => void, colorMode: ColorMode }) => {
    return (
        <ToggleContainer onClick={onToggle} backgroundColor={colorMode === "light" ? "blue.200" : "black"} border="0.125em solid blue.200"
        >
            <Switch colorMode={colorMode} />
        </ToggleContainer >
    );
};


