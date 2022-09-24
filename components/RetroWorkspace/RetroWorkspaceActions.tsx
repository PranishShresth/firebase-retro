import {
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { darken } from "@chakra-ui/theme-tools";
import { AlertDialogBar } from "components/Alert";
import { LeaveWorkspaceModal } from "components/Modals/LeaveWorkspaceModal";
import { ViewMembersModal } from "components/Modals/ViewMembersModal";
import { firestore } from "configs/firebase/firestore";
import { useAuthContext } from "context/Auth/AuthContext";
import { useRetroContext } from "context/RetroBoard/RetroBoardContext";
import { doc, arrayRemove, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FaEllipsisV } from "react-icons/fa";
import styled from "styled-components";
import { Collection } from "utils/firebaseCollection";
import { Member, Workspace } from "utils/interfaces";

const MEMBER_ICON_LIMIT = 3;

const AvatarWrapper = styled.div`
  @media (max-width: 480px) {
    display: none;
  }
`;
interface RetroWorkspaceActionsProps {
  members: Member[];
  openMemberSelect: () => void;
  removeWorkspace: (workspaceId: string) => void;
  updateWorkspace: (workspace: Workspace) => void;
  userId: string;
  workspaceId: string;
  workspaceTitle: string;
}
export const RetroWorkspaceActions = ({
  members,
  openMemberSelect: pushOpenMemberSelect,
  removeWorkspace: pushRemoveWorkspace,
  updateWorkspace: pushUpdateWorkspace,
  userId,
  workspaceId,
  workspaceTitle,
}: RetroWorkspaceActionsProps) => {
  const { member } = useAuthContext();
  const {
    board: { board },
  } = useRetroContext();
  const [deleteModalOpen, setdeleteModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const [deleteWorkspaceProgressing, setDeleteWorkspaceProgressing] =
    useState(false);
  const [leaveWorkspaceProgressing, setLeaveWorkspaceProgressing] =
    useState(false);
  const toast = useToast();
  const userIsCreator = member?.userId === userId;

  const currentWorkspaceRef = doc(
    firestore,
    Collection.Workspaces,
    workspaceId
  );

  // TODO
  const handleDeleteWorkspace = async () => {
    try {
    } catch (err) {
      console.log(err);
    }
  };

  const handleLeaveWorkspace = async () => {
    try {
      setLeaveWorkspaceProgressing(true);
      if (member) {
        const userRef = doc(firestore, Collection.Users, member.userId);

        const updatedMembers = members.filter(
          (m) => m.userId !== member.userId
        );
        await Promise.all([
          updateDoc(userRef, {
            workspaces: arrayRemove(workspaceId),
          }),
          updateDoc(currentWorkspaceRef, {
            members: updatedMembers,
          }),
        ]);
        setLeaveWorkspaceProgressing(false);
        setLeaveModalOpen(false);

        pushRemoveWorkspace(workspaceId);
        toast({
          title: "You successfully have left the workspace",
          description: "You will no longer have access to that workspace",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
      setLeaveWorkspaceProgressing(false);
    }
  };

  return (
    <Flex alignItems="center">
      {members &&
        members.slice(0, MEMBER_ICON_LIMIT).map((member) => {
          const label = `${member.firstName} ${member.lastName}`;
          return (
            <Tooltip
              bg="gray.300"
              color="black"
              className="hideOnlyMobile"
              hasArrow
              key={member.userId}
              label={label}
            >
              <Avatar
                className="hideOnlyMobile"
                name={label}
                size="sm"
                marginRight="4px"
              />
            </Tooltip>
          );
        })}
      {members && members.length > MEMBER_ICON_LIMIT && (
        <Box
          alignItems="center"
          backgroundColor="#cccccc"
          borderRadius="50%"
          className="hideOnlyMobile"
          display="flex"
          height="2rem"
          justifyContent="center"
          marginRight="4px"
          width="2rem"
        >
          <Box color="#1a202c" fontSize="calc(2rem / 2.5)">
            +{members.length - MEMBER_ICON_LIMIT}
          </Box>
        </Box>
      )}
      {userIsCreator && (
        <Button
          backgroundColor={"#00B5AD"}
          color={"white"}
          marginLeft="8px"
          onClick={pushOpenMemberSelect}
          _hover={{ backgroundColor: darken("#00B5AD", 8) }}
        >
          Invite&nbsp;
          <AiOutlineUserAdd />
        </Button>
      )}
      <AlertDialogBar
        isOpen={deleteModalOpen}
        onClose={() => setdeleteModalOpen(false)}
        onClick={handleDeleteWorkspace}
        isLoading={deleteWorkspaceProgressing}
        title="Delete Workspace"
        ariaLabel="Delete Workspace Alert"
      />
      <ViewMembersModal
        isOpen={membersModalOpen}
        members={members}
        onClose={() => setMembersModalOpen(false)}
        pushUpdateWorkspace={pushUpdateWorkspace}
        userIsCreator={userIsCreator}
        workspaceTitle={workspaceTitle}
        workspaceId={workspaceId}
      />
      <LeaveWorkspaceModal
        isLoading={leaveWorkspaceProgressing}
        isOpen={leaveModalOpen}
        onClick={handleLeaveWorkspace}
        onClose={() => setLeaveModalOpen(false)}
        workspaceTitle={workspaceTitle}
      />

      <Menu>
        <MenuButton
          background="none !important"
          borderRadius="sm"
          marginLeft="12px"
          position="relative"
          right="0"
          top="2px"
          transition="all 0.2s"
          _focus={{ boxShadow: "outline" }}
        >
          <Icon as={FaEllipsisV} size={16} />
        </MenuButton>
        <MenuList>
          {userIsCreator ? (
            <>
              <MenuItem onClick={() => console.log("edit")}>Edit</MenuItem>
              <MenuItem onClick={() => setMembersModalOpen(true)}>
                View Members
              </MenuItem>
              <MenuItem
                color="#E53E3E"
                onClick={() => setdeleteModalOpen(true)}
              >
                Delete
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem onClick={() => setMembersModalOpen(true)}>
                View Members
              </MenuItem>
              <MenuItem color="#E53E3E" onClick={() => setLeaveModalOpen(true)}>
                Leave
              </MenuItem>
            </>
          )}
        </MenuList>
      </Menu>
    </Flex>
  );
};
