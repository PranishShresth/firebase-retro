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
  Flex,
} from "@chakra-ui/react";
import { useAuthContext } from "context/Auth/AuthContext";
import { Member } from "utils/interfaces";

export const ViewMembersModal = ({
  isOpen,
  members,
  onClose,
  userIsCreator,
  workspaceTitle,
}: {
  isOpen: boolean;
  members: Member[];
  onClose: () => void;
  userIsCreator: boolean;
  workspaceTitle: string;
}) => {
  const { member } = useAuthContext();
  const borderColour = useColorModeValue("#cccccc", "#171923");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">{workspaceTitle} Members</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <UnorderedList
            boxShadow="0 4px 4px -4px #ccc"
            marginInlineStart="0"
            maxHeight="400px"
            overflowY="scroll"
          >
            {members.map(({ email, firstName, lastName, userId }, index) => {
              const fullName = `${firstName} ${lastName}`;
              const showKickButton = userIsCreator && member?.userId !== userId;

              return (
                <ListItem
                  alignItems="center"
                  borderBottom={`1px solid ${borderColour}`}
                  borderTop={index === 0 ? `1px solid ${borderColour}` : "none"}
                  display="flex"
                  justifyContent="space-between"
                  key={userId}
                  listStyleType="none"
                  padding="1rem"
                >
                  <Flex>
                    <Avatar name={fullName} size="sm" marginRight="8px" />
                    <Box lineHeight="1.2">
                      <div>{fullName}</div>
                      <Text as="i" fontSize="12px">
                        {email}
                      </Text>
                    </Box>
                  </Flex>
                  {showKickButton && (
                    <Button colorScheme="red" variant="outline">
                      Kick
                    </Button>
                  )}
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
