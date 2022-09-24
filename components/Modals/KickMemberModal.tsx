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

export const KickMemberModal = ({
  isLoading,
  isOpen,
  onClick,
  onClose,
  memberName,
}: {
  isLoading?: boolean;
  isOpen: boolean;
  onClick: () => void;
  onClose: () => void;
  memberName: string;
}) => {
  const cancelRef = useRef(null);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent margin="3.75rem 1rem">
        <ModalHeader>Kick {memberName}?</ModalHeader>
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
            Kick
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
