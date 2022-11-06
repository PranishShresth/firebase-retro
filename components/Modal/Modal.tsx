import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Button,
  ModalBody,
  ModalCloseButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { darken } from "@chakra-ui/theme-tools";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { FiPlusCircle } from "react-icons/fi";
import styled from "styled-components";

const ButtonText = styled.span`
  margin-left: 4px;
`;

const CreateBoardButton = styled(Button)`
  border: ${({ color }) => `1px solid ${color}`};
  height: 100% !important;
  min-height: 60px;
  width: 100% !important;
`;
interface Props {
  children?: React.ReactNode;
  createBoard?: boolean;
  triggerName?: string;
  modalTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const Modal = ({
  onClose,
  onOpen,
  modalTitle,
  isOpen,
  triggerName,
  createBoard,
  children,
}: Props) => {
  const bg = useColorModeValue("white", "gray.600");

  return (
    <>
      {createBoard
        ? triggerName && (
            <CreateBoardButton
              onClick={onOpen}
              backgroundColor={bg}
              color="#2bc0c1"
            >
              <FiPlusCircle size={24} />
              <ButtonText>{triggerName}</ButtonText>
            </CreateBoardButton>
          )
        : triggerName && (
            <>
              <Button
                onClick={onOpen}
                background="#CFFF18"
                className="hideOnlyMobile"
                color="black"
                _hover={{ backgroundColor: darken("#CFFF18", 8) }}
                padding="0px 24px 0px 24px"
                fontWeight="normal"
              >
                {triggerName}
              </Button>
              <Button
                onClick={onOpen}
                className="showOnlyMobile"
                _hover={{ backgroundColor: darken("#CFFF18", 8) }}
                padding="0px 24px 0px 24px"
              >
                <AiOutlineUnorderedList />
              </Button>
            </>
          )}

      <ChakraModal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent margin="3.75rem 1rem">
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
        </ModalContent>
      </ChakraModal>
    </>
  );
};
