import { Tooltip } from "@chakra-ui/react";
import { darken } from "@chakra-ui/theme-tools";
import styled from "styled-components";

const ColourInput = styled.input`
  left: 4px;
  position: absolute;
  top: 4px;

  &:checked + .custom-colour-input {
    box-shadow: inset 0 0 0 3px #000000;
  }
`;

const ColourLabel = styled.label`
  margin: 4px;
  position: relative;
`;

const ColourRow = styled.div`
  display: flex;
`;

const CustomColourInput = styled.div<{ colour: string }>`
  background: ${({ colour }) => colour};
  border-radius: 4px;
  height: 30px;
  position: relative;
  width: 30px;

  &:hover {
    background-color: ${({ colour }) => darken(colour, 4)};
    cursor: pointer;
  }
`;

export enum Colours {
  fireOpal = "#E8575B",
  mangoTango = "#F78645",
  mikadoYellow = "#FBBD08",
  jasmine = "#F0DE77",
  middleGreen = "#549462",
  americanGreen = "#28A745",
  tiffanyBlue = "#00B5AD",
  glaucous = "#5B7ABA",
  azure = "#007BFF",
  darkOrchid = "#A333C8",
}

export const ColourPicker = ({ field }: any) => {
  return (
    <ColourRow>
      {Object.entries(Colours).map(([key, value]) => {
        const capitaliseFirstLetter =
          key.charAt(0).toUpperCase() + key.slice(1);
        const tooltipLabel = capitaliseFirstLetter.replace(/([A-Z])/g, " $1");
        return (
          <Tooltip
            bg="gray.300"
            color="black"
            hasArrow
            key={key}
            label={tooltipLabel}
          >
            <ColourLabel htmlFor={key}>
              <ColourInput {...field} id={key} type="radio" value={value} />
              <CustomColourInput
                className="custom-colour-input"
                colour={value}
              />
            </ColourLabel>
          </Tooltip>
        );
      })}
    </ColourRow>
  );
};
