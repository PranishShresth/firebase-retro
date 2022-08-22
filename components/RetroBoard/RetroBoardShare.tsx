import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BiShareAlt } from "react-icons/bi";
import { QRCodeSVG } from "qrcode.react";

async function copyTextToClipboard(text: string) {
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
}

export const RetroBoardShare = ({ boardId }: { boardId: string }) => {
  const {
    isOpen,
    onOpen: openShareModal,
    onClose: closeShareModal,
  } = useDisclosure();
  const [isCopied, setIsCopied] = useState(false);

  const url = `https://${window.location.hostname}/board/${boardId}`;

  const handleClipBoard = async () => {
    await copyTextToClipboard(url);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };
  return (
    <>
      <Button leftIcon={<BiShareAlt />} onClick={openShareModal}>
        Share
      </Button>
      <Modal onClose={closeShareModal} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share Board</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack
              align="center"
              justify="center"
              spacing={6}
              paddingBottom="10px"
            >
              <InputGroup size="md">
                <Input pr="4.5rem" type="text" value={url} disabled />
                <InputRightElement width="4.5rem">
                  <Button
                    colorScheme="teal"
                    h="1.75rem"
                    size="sm"
                    onClick={handleClipBoard}
                  >
                    {isCopied ? "Copied" : "Copy"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <QRCodeSVG
                value={url}
                size={144}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"L"}
                includeMargin={false}
              />
              <Text>
                Members with this url will be able to access this board
              </Text>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
