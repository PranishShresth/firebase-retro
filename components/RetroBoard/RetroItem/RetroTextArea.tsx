import { Textarea } from "@chakra-ui/react";
import styled from "styled-components";

export const RetroTextArea = styled(Textarea)`
  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  /* Track */
  &::-webkit-scrollbar-track-piece {
    background: ${({ $isDarkMode }) => ($isDarkMode ? "#1c2a3a" : "#DADADA")};
    border-radius: 4px;
  }
  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: ${({ $isDarkMode }) => ($isDarkMode ? "#e7ff8e" : "#1c2a3a")};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-button {
    display: block;
    height: 100px;
    width: 4px;
  }
`;
