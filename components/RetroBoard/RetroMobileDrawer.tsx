/* eslint-disable @next/next/no-img-element */
import {
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Stack,
  Box,
  IconButton,
} from "@chakra-ui/react";
import LogoIcon from "icons/LogoIcon";
import React from "react";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { RetroBoardFilter } from "./RetroBoardFilter";
import { RetroBoardShare } from "./RetroBoardShare";
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
