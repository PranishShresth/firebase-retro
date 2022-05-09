import React from "react";
import styled, { keyframes } from "styled-components";

const dualRing = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const DualRing = styled.div`
  display: inline-block;
  height: 80px;
  margin: auto;
  position: relative;
  width: 80px;

  &:after {
    animation: ${dualRing} 1.2s linear infinite;
    border: 6px solid white;
    border-color: #2bc0c1 transparent #2bc0c1 transparent;
    border-radius: 50%;
    content: " ";
    display: block;
    height: 64px;
    margin: 8px;
    width: 64px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;

  left: 0;
  position: absolute;
  top: 0;
  z-index: 5;
`;

const DualRingLoader = (props: any) => {
  return (
    <Wrapper {...props}>
      <DualRing {...props}></DualRing>
    </Wrapper>
  );
};

export default DualRingLoader;
