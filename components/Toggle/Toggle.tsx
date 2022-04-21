import { ColorMode, Box } from "@chakra-ui/react";
import { BsDot } from "react-icons/bs";
import { FaCloud } from "react-icons/fa";
import { IoIosPlanet } from "react-icons/io";
import styled from "styled-components";
const ToggleContainer = styled(Box)`
  font-size: 1rem;
  width: 4.5em;
  border-radius: 4.5em;
  padding: 0.25em;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s linear;
  position: relative;
`;

const SmallCloud = styled(FaCloud)`
  color: white;
  font-size: 0.75em;
  position: absolute;
  right: 2.25em;
  top: 0.125em;
`;

const BigCloud = styled(FaCloud)`
  color: white;
  font-size: 1em;
  position: absolute;
  right: 0.5em;
  top: 0.75em;
`;

const Planet = styled(IoIosPlanet)`
  color: white;
  font-size: 1em;
  position: absolute;
  left: 0.5em;
  top: 0.75em;
`;

const Dot = styled(BsDot)`
  color: white;
  font-size: 0.75em;
  position: absolute;
  left: 1.5em;
  top: 0.125em;
`;

const BiggerDot = styled(BsDot)`
  color: white;
  font-size: 1.25em;
  position: absolute;
  left: 1.2em;
  top: 0.3em;
`;

const Switch = styled.div<{ colorMode: ColorMode }>`
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
  background-color: ${({ colorMode }) =>
    colorMode === "light" ? "#FBBD08" : "white"};
  position: relative;
  transform: ${({ colorMode }) =>
    colorMode === "light" ? "translateX(0)" : "translateX(2.5em)"};
  transition: inherit;
`;

export const DarkModeToggle = ({
  onToggle,
  colorMode,
}: {
  onToggle: () => void;
  colorMode: ColorMode;
}) => {
  const isLightMode = colorMode === "light";
  return (
    <ToggleContainer
      onClick={onToggle}
      backgroundColor={isLightMode ? "blue.200" : "black"}
      border="0.125em solid blue.200"
    >
      <Switch colorMode={colorMode} />
      {isLightMode ? (
        <>
          <SmallCloud />
          <BigCloud />
        </>
      ) : (
        <>
          <Dot />
          <BiggerDot />
          <Planet />
        </>
      )}
    </ToggleContainer>
  );
};
