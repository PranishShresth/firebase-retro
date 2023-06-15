import {
  Avatar,
  Box,
  Button,
  Flex,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { firestore } from "configs/firebase/firestore";
import { useAuthContext } from "context/Auth/AuthContext";
import { arrayRemove, doc, getDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Collection } from "utils/firebaseCollection";
import { Member, Workspace } from "utils/interfaces";
import { KickMemberModal } from "./KickMemberModal";

export const ViewMembersModal = ({
  isOpen,
  members,
  onClose,
  pushUpdateWorkspace,
  userIsCreator,
  workspaceId,
  workspaceTitle,
}: {
  isOpen: boolean;
  members: Member[];
  onClose: () => void;
  pushUpdateWorkspace: (workspace: Workspace) => void;
  userIsCreator: boolean;
  workspaceId: string;
  workspaceTitle: string;
}) => {
  const { member } = useAuthContext();
  const borderColour = useColorModeValue("#cccccc", "#171923");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent margin="3.75rem 1rem">
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
                    <Box lineHeight="1.2" marginRight="0.5rem">
                      <div>{fullName}</div>
                      <Text as="i" fontSize="12px">
                        {email}
                      </Text>
                    </Box>
                  </Flex>
                  {showKickButton && (
                    <KickMember
                      userId={userId}
                      workspaceId={workspaceId}
                      members={members}
                      fullName={fullName}
                      pushUpdateWorkspace={pushUpdateWorkspace}
                    />
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

const KickMember = ({
  userId,
  workspaceId,
  members,
  fullName,
  pushUpdateWorkspace,
}: {
  userId: string;
  workspaceId: string;
  members: Member[];
  fullName: string;
  pushUpdateWorkspace: (workspace: Workspace) => void;
}) => {
  const [kickModalOpen, setKickModalOpen] = useState(false);
  const [kickMemberProgressing, setKickMemberProgressing] = useState(false);
  const toast = useToast();

  const handleKickMember = async (userId: string) => {
    const workspaceRef = doc(firestore, Collection.Workspaces, workspaceId);
    try {
      setKickMemberProgressing(true);

      const currentWorkspaceRef = doc(
        firestore,
        Collection.Workspaces,
        workspaceId
      );
      const userRef = doc(firestore, Collection.Users, userId);
      const updatedMembers = members.filter((m) => m.userId !== userId);

      await Promise.all([
        updateDoc(userRef, {
          workspaces: arrayRemove(workspaceId),
        }),
        updateDoc(currentWorkspaceRef, {
          members: updatedMembers,
        }),
      ]);
      const workspace = await (await getDoc(workspaceRef)).data();
      pushUpdateWorkspace(workspace as Workspace);

      setKickMemberProgressing(false);
      setKickModalOpen(false);

      toast({
        title: "User successfully kicked from workspace",
        description: "Kicked user will no longer have access to this workspace",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      setKickMemberProgressing(false);
    }
  };

  return (
    <>
      <KickMemberModal
        isLoading={kickMemberProgressing}
        isOpen={kickModalOpen}
        onClick={() => handleKickMember(userId)}
        onClose={() => setKickModalOpen(false)}
        memberName={fullName}
      />
      <Button
        colorScheme="red"
        onClick={() => setKickModalOpen(true)}
        variant="outline"
      >
        Kick
      </Button>
    </>
  );
};
