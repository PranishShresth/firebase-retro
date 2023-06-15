/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { RetroBoardFilter } from "./RetroBoardHeader/RetroBoardFilter";
import { RetroBoardShare } from "./RetroBoardHeader/RetroBoardShare";
import { RetroColumnCreate } from "./RetroList/AddList";

export const RetroMobileDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef(null);

  return (
    <>
      <Box marginRight={8}>
        <IconButton
          aria-label="drawer"
          background="none"
          ref={btnRef}
          onClick={onOpen}
          icon={<IoEllipsisVerticalSharp size={24} />}
        />
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent maxW={100} padding="0">
          <DrawerHeader>
            <img src="/logo1.svg" alt="logo" />
          </DrawerHeader>
          <DrawerBody>
            <Stack direction="column" spacing={4}>
              <RetroBoardFilter />
              <RetroBoardShare />

              <RetroColumnCreate />
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
