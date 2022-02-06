import { Skeleton, Grid } from "@chakra-ui/react";
import React from "react";

const SkeletonLoader = ({
  amount,
  height,
  width,
}: {
  amount: number;
  height: string;
  width: string;
}) => {
  return (
    <>
      {Array.from(Array(amount).keys()).map((_, i) => {
        return <Skeleton key={i} height={height} width={width}></Skeleton>;
      })}
    </>
  );
};

export default SkeletonLoader;
