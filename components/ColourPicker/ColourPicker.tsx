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

enum Colours {
  pink = "#E03997",
  red = "#DB2828",
  orange = "#F2711C",
  yellow = "#FBBD08",
  olive = "#B5CC18",
  green = "#21BA45",
  teal = "#00B5AD",
  blue = "#2185D0",
  violet = "#6435C9",
  purple = "#A333C8",
}

export const ColourPicker = ({ field }: any) => {
  return (
    <ColourRow>
      {Object.entries(Colours).map(([key, value]) => (
        <ColourLabel htmlFor={key} key={key}>
          <ColourInput {...field} id={key} type="radio" value={value} />
          <CustomColourInput className="custom-colour-input" colour={value} />
        </ColourLabel>
      ))}
    </ColourRow>
  );
};
