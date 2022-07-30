import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Button,
  Stack,
  useToast,
  Box,
} from "@chakra-ui/react";
import { RetroWorkspaceActions } from "components/RetroWorkspace/RetroWorkspaceActions";
import UserSelect from "components/UserSelect";
import { firestore } from "configs/firebase/firestore";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Collection } from "utils/firebaseCollection";
import { Member } from "utils/interfaces";

interface FormData {
  members: Member[];
}
export const RetroMemberSelectModal = ({
  members,
  workspaceId,
  userId,
}: {
  members: Member[];
  workspaceId: string;
  userId: string;
}) => {
  const {
    isOpen,
    onClose: closeMemberSelect,
    onOpen: openMemberSelect,
  } = useDisclosure();
  const { control, handleSubmit, formState, reset } = useForm<FormData>({
    defaultValues: {
      members: [],
    },
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  //TODO: Fix typing on any
  const inviteMembers = async (data: any) => {
    try {
      setLoading(true);
      const allInvitees = data.members
        .map(({ value: member }: { value: Member }) => {
          const memberId = member.userId;
          console.log(member);

          const userRef = doc(firestore, Collection.Users, memberId);

          const workspaceRef = doc(
            firestore,
            Collection.Workspaces,
            workspaceId
          );

          return [
            updateDoc(workspaceRef, {
              members: arrayUnion(member),
            }),
            updateDoc(userRef, {
              workspaces: arrayUnion(workspaceId),
            }),
          ];
        })
        .flat();
      await Promise.all(allInvitees);
      setLoading(false);
      closeMemberSelect();
      reset();

      toast({
        title: "Invited!",
        description: "Invitees will be able to access this workspace",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  return (
    <Box>
      <RetroWorkspaceActions
        members={members}
        openMemberSelect={openMemberSelect}
        userId={userId}
        workspaceId={workspaceId}
      />

      <Modal isOpen={isOpen} onClose={closeMemberSelect}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invite Members</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(inviteMembers)}>
              <Stack direction="column" spacing={3}>
                <span>Choose who can access:</span>

                <Controller
                  control={control}
                  name="members"
                  render={({ field }) => (
                    <UserSelect field={field} members={members} />
                  )}
                />
                <div>
                  <Button
                    colorScheme="teal"
                    isLoading={loading}
                    marginBottom="12px"
                    type="submit"
                  >
                    Invite
                  </Button>
                </div>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
