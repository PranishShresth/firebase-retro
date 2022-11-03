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
import React from "react";
import { BiShareAlt } from "react-icons/bi";
import { QRCodeSVG } from "qrcode.react";
import { useClipboard } from "hooks/useClipboard";

export const RetroBoardShare = ({ boardId }: { boardId: string }) => {
  const {
    isOpen,
    onOpen: openShareModal,
    onClose: closeShareModal,
  } = useDisclosure();
  const [isCopied, handleClipBoard] = useClipboard();

  const url = `https://${window.location.hostname}/board/${boardId}`;

  return (
    <>
      <Button
        borderRadius="4px"
        className="hideOnlyMobile"
        leftIcon={<BiShareAlt />}
        onClick={openShareModal}
        padding="0px 24px 0px 24px"
        variant="outline"
      >
        Share
      </Button>
      <Button className="showOnlyMobile" onClick={openShareModal}>
        <BiShareAlt />
      </Button>
      <Modal onClose={closeShareModal} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent margin="3.75rem 1rem">
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
                    onClick={() => handleClipBoard(url)}
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
