/* eslint-disable @next/next/no-img-element */
import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import styled from "styled-components";

const StyledDiv = styled.div`
  align-self: center;
  flex: 1;
  height: 100%;
  justify-self: center;
  max-height: 600px;
  max-width: 400px;
  position: relative;
  width: 100%;
`;

const NoWorkspaces = () => {
  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      height="100%"
      justifyContent="center"
      marginBottom="2rem"
    >
      <StyledDiv>
        <img
          src="/noWorkspaces.png"
          alt="No workspaces, why not create one?"
          width="100%"
          height="50%"
        />
      </StyledDiv>
      <Text color="#cccccc" fontSize="2rem" fontWeight="bold">
        No workspaces here, why not create one?
      </Text>
    </Flex>
  );
};

export default NoWorkspaces;
