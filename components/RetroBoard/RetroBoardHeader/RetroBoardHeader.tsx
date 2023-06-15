import {
  Box,
  Stack,
  Text,
  useColorModeValue,
  useMediaQuery,
} from "@chakra-ui/react";
import { useBoard } from "context/RetroBoard/RetroBoardContext";
import { format } from "date-fns";
import Link from "next/link";
import { IoArrowBackSharp } from "react-icons/io5";
import { MAX_SCREEN_WIDTH } from "utils/constants";
import { RetroColumnCreate } from "../RetroList/AddList";
import { RetroMobileDrawer } from "../RetroMobileDrawer";
import { RetroBoardFilter } from "./RetroBoardFilter";
import { RetroBoardShare } from "./RetroBoardShare";
import { RetroBoardSort } from "./RetroBoardSort";

const RetroBoardHeader = () => {
  const {
    board: { board, workspace },
  } = useBoard();

  const bg = useColorModeValue("white", "#1C2A3A");
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  return (
    <Stack
      direction="row"
      alignItems="center"
      width={{ base: "100%", md: "95%" }}
      margin={{ base: "2px 0 0 0", md: "32px auto 0 auto" }}
      maxWidth={MAX_SCREEN_WIDTH}
      background={{ base: bg, md: "none" }}
      height={{ base: "60px" }}
      justifyContent="space-between"
    >
      <Link href={`/`} passHref>
        <Box
          padding="0 16px"
          borderRight="1px solid grey"
          display={{ md: "none" }}
          cursor="pointer"
        >
          <IoArrowBackSharp fontSize={32} />
        </Box>
      </Link>
      <Stack
        direction="column"
        height="100%"
        width="100%"
        justifyContent="center"
      >
        <Text
          fontWeight="bold"
          fontSize={{ base: "16px", md: "26px" }}
          textTransform="capitalize"
          lineHeight={1}
        >
          {board?.boardTitle}
        </Text>
        <Stack direction="row">
          <Link href={`/workspace/${workspace.workspaceId}/boards`} passHref>
            <Text
              fontSize={{ base: "14px" }}
              margin="0 !important"
              paddingRight="8px"
              textDecoration="underline"
              borderRight={{ base: "none", sm: "1px solid grey" }}
              lineHeight={1}
              cursor="pointer"
            >
              {workspace.workspaceTitle}
            </Text>
          </Link>

          <Text
            fontSize={{ base: "14px" }}
            margin="0 0 0 8px !important"
            display={{ base: "none", sm: "block" }}
            lineHeight={1}
          >
            {format(new Date(board.createdAt.seconds * 1000), "dd MMMM yyyy")}
          </Text>
        </Stack>
      </Stack>

      {isMobile && <RetroMobileDrawer />}

      <Stack display={{ base: "none", md: "flex" }} direction="row">
        {/* <RetroTimer board={board} /> */}
        <RetroBoardFilter />
        <RetroBoardShare />
        <RetroBoardSort />
        <RetroColumnCreate />
      </Stack>
    </Stack>
  );
};

export default RetroBoardHeader;
