import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";

export const LeaveWorkspaceModal = ({
  isLoading,
  isOpen,
  onClick,
  onClose,
  workspaceTitle,
}: {
  isLoading?: boolean;
  isOpen: boolean;
  onClick: () => void;
  onClose: () => void;
  workspaceTitle: string;
}) => {
  const cancelRef = useRef(null);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent margin="3.75rem 1rem">
        <ModalHeader>Leave {workspaceTitle}?</ModalHeader>
        <ModalBody>
          Are you sure? You can&apos;t undo this action afterwards.
        </ModalBody>

        <ModalFooter>
          <Button ref={cancelRef} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            onClick={onClick}
            ml={3}
            isLoading={!!isLoading}
          >
            Leave
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
