import { Grid, Stack, Skeleton } from "@chakra-ui/react";
import React from "react";
import { MAX_SCREEN_WIDTH } from "utils/constants";

export const RetroBoardSkeleton = () => {
  return (
    <Stack
      padding={4}
      maxWidth={MAX_SCREEN_WIDTH}
      margin="0 auto"
      direction="column"
      width="100%"
      height="100%"
      overflow="hidden"
      spacing={3}
    >
      <Skeleton width="100%" height="80px" />
      <Grid
        flex="1"
        templateColumns={{
          base: "repeat(3, 300px)",
        }}
        gap={15}
      >
        <Stack direction="column" spacing={3}>
          <Skeleton amount={3} width="300px" height="90%" />
          <Skeleton width="300px" height="40px" />
        </Stack>
        <Stack direction="column" spacing={3}>
          <Skeleton amount={3} width="300px" height="50%" />
          <Skeleton width="300px" height="40px" />
        </Stack>
        <Stack direction="column" spacing={3}>
          <Skeleton amount={3} width="300px" height="70%" />
          <Skeleton width="300px" height="40px" />
        </Stack>
      </Grid>
    </Stack>
  );
};
