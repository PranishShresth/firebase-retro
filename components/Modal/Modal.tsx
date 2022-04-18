import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Button,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
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
  return (
    <>
      {createBoard
        ? triggerName && (
            <CreateBoardButton
              onClick={onOpen}
              background="#ffffff"
              color="#4886ff"
            >
              <FiPlusCircle size={24} />
              <ButtonText>{triggerName}</ButtonText>
            </CreateBoardButton>
          )
        : triggerName && (
            <Button onClick={onOpen} background="#4886ff" color="white">
              {triggerName}
            </Button>
          )}

      <ChakraModal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
        </ModalContent>
      </ChakraModal>
    </>
  );
};
