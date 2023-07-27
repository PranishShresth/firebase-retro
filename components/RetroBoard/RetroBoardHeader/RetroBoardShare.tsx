import {
  Button,
  IconButton,
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
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useClipboard } from "hooks/useClipboard";
import { useRouter } from "next/router";
import { QRCodeSVG } from "qrcode.react";
import { BiShareAlt } from "react-icons/bi";

export const RetroBoardShare = () => {
  const {
    isOpen,
    onOpen: openShareModal,
    onClose: closeShareModal,
  } = useDisclosure();
  const [isCopied, handleClipBoard] = useClipboard();
  const router = useRouter();
  const { boardId } = router.query;

  const url = `https://${window.location.hostname}/board/${boardId}`;

  return (
    <>
      <Tooltip bg="gray.300" color="black" hasArrow label={"Share"}>
        <IconButton
          aria-label="share"
          onClick={openShareModal}
          icon={<BiShareAlt />}
          variant="outline"
        />
      </Tooltip>

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
