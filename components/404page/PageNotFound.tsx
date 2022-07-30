/* eslint-disable @next/next/no-img-element */
import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import styled from "styled-components";

const StyledDiv = styled.div`
  align-self: center;
  flex: 1;
  height: 100%;
  justify-self: center;
  max-height: 400px;
  max-width: 400px;
  position: relative;
  width: 100%;
`;

const NoPageFound = () => {
  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      height="100%"
      justifyContent="center"
    >
      <StyledDiv>
        <img
          src="/404.png"
          alt="404 page not found"
          width="100%"
          height="50%"
        />
      </StyledDiv>
      <Text color="#cccccc" fontSize="2rem" fontWeight="bold">
        Oops! Page not found.
      </Text>
    </Flex>
  );
};

export default NoPageFound;
