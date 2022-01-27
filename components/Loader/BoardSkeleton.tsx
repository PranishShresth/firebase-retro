import { Skeleton, Grid } from "@chakra-ui/react";
import React from "react";

const BoardSkeleton = ({ amount }: { amount: number }) => {
  return (
    <Grid
      templateColumns={{
        base: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(5, 1fr)",
      }}
      justifyContent="center"
      gap={6}
    >
      {Array.from(Array(amount).keys()).map((_, i) => {
        return <Skeleton key={i} height="60px" width="240px"></Skeleton>;
      })}
    </Grid>
  );
};

export default BoardSkeleton;
