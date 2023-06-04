import { Grid, Stack } from "@chakra-ui/react";
import React from "react";
import { MAX_SCREEN_WIDTH } from "utils/constants";
import Skeleton from "./Skeleton";

export const RetroBoardSkeleton = () => {
  return (
    <Stack
      padding="25px 0 15px 24px"
      maxWidth={MAX_SCREEN_WIDTH}
      margin="0 auto"
      direction="column"
      width="100%"
      height="100%"
      spacing={3}
    >
      <Skeleton amount={1} width="100%" height="80px" />
      {/* <Grid
        flex="1"
        templateColumns={{
          base: "1fr",
          sm: "repeat(3, 1fr)",
        }}
        justifyContent="center"
        gap={15}
      >
        <Skeleton amount={3} width="100%" height="80%" />
      </Grid> */}
    </Stack>
  );
};
