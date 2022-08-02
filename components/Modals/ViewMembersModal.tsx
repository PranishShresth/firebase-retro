import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  ListItem,
  UnorderedList,
  Avatar,
  Text,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { Member } from "utils/interfaces";

export const ViewMembersModal = ({
  isOpen,
  members,
  onClose,
  workspaceTitle,
}: {
  isOpen: boolean;
  members: Member[];
  onClose: () => void;
  workspaceTitle: string;
}) => {
  const borderColour = useColorModeValue("#cccccc", "#171923");
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">{workspaceTitle} Members</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <UnorderedList marginInlineStart="0">
            {members.map(({ email, firstName, lastName, userId }, index) => {
              const fullName = `${firstName} ${lastName}`;
              return (
                <ListItem
                  alignItems="center"
                  borderBottom={`1px solid ${borderColour}`}
                  borderTop={index === 0 ? `1px solid ${borderColour}` : "none"}
                  display="flex"
                  key={userId}
                  listStyleType="none"
                  padding="1rem"
                >
                  <Avatar name={fullName} size="sm" marginRight="8px" />
                  <Box lineHeight="1.2">
                    <div>{fullName}</div>
                    <Text as="i" fontSize="12px">
                      {email}
                    </Text>
                  </Box>
                </ListItem>
              );
            })}
          </UnorderedList>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
