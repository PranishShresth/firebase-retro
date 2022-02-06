import React from "react";
import styled from "styled-components";
import Image from "next/image";
const StyledDiv = styled.div`
  flex: 1;
  align-self: center;
  justify-self: center;
  width: 100%;
  height: 100%;
  position: relative;
`;
const NoPageFound = () => {
  return (
    <StyledDiv>
      <Image
        src="/404.png"
        alt="404 page not found"
        width="100%"
        height="50%"
        layout="responsive"
        objectFit="contain"
      />
    </StyledDiv>
  );
};

export default NoPageFound;
