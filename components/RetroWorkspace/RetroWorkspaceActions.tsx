import {
  Avatar,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import { darken } from "@chakra-ui/theme-tools";
import { AlertDialogBar } from "components/Alert";
import { firestore } from "configs/firebase/firestore";
import { useAuthContext } from "context/Auth/AuthContext";
import {
  deleteDoc,
  doc,
  query,
  collection,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FaEllipsisV } from "react-icons/fa";
import styled from "styled-components";
import { Collection } from "utils/firebaseCollection";
import { Member } from "utils/interfaces";

const MEMBER_ICON_LIMIT = 3;

const StyledLink = styled.a`
  color: #2bc0c1;
  font-size: 14px;
  margin: 0 8px;
  text-decoration: underline;
`;

interface RetroWorkspaceActionsProps {
  members: Member[];
  openMemberSelect: () => void;
  userId: string;
  workspaceId: string;
}
export const RetroWorkspaceActions = ({
  members,
  openMemberSelect: pushOpenMemberSelect,
  userId,
  workspaceId,
}: RetroWorkspaceActionsProps) => {
  const { member } = useAuthContext();
  const [deleteModalOpen, setdeleteModalOpen] = useState(false);
  const [deleteWorkspaceProgressing, setDeleteWorkspaceProgressing] =
    useState(false);
  const allowInvites = member?.userId === userId;

  // TODO
  const handleDeleteWorkspace = async () => {
    try {
      setDeleteWorkspaceProgressing(true);
      const currentWorkspaceRef = doc(
        firestore,
        Collection.Workspaces,
        workspaceId
      );
      const batch = writeBatch(firestore);

      const boardsQ = query(
        collection(firestore, Collection.Boards),
        where("workspaceId", "==", workspaceId)
      );

      // const usersQ = query(collection(firestore, Collection.Users),
      // where("workspaceId", "==", workspaceId))
      // const itemsQ = query(
      //   collection(firestore, "items"),
      //   where("boardId", "==", board.boardId)
      // );
      // const listsQ = query(
      //   collection(firestore, "lists"),
      //   where("boardId", "==", board.boardId)
      // );
      const [
        boards,
        // items,
        // lists
      ] = await Promise.all([
        getDocs(boardsQ),
        // getDocs(itemsQ),
        // getDocs(listsQ),
      ]);

      boards.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      // items.docs.forEach((doc) => {
      //   batch.delete(doc.ref);
      // });
      // lists.docs.forEach((doc) => {
      //   batch.delete(doc.ref);
      // });

      // commits the batched delete for both items and boards
      await batch.commit();

      await deleteDoc(currentWorkspaceRef);
      setDeleteWorkspaceProgressing(false);
      setdeleteModalOpen(false);
    } catch (err) {
      console.log(err);
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
              hasArrow
              key={member.userId}
              label={label}
            >
              <Avatar name={label} size="sm" marginRight="4px" />
            </Tooltip>
          );
        })}
      {members && members.length > MEMBER_ICON_LIMIT && (
        <Link href="javascript:void(0)" passHref>
          <StyledLink>View all</StyledLink>
        </Link>
      )}
      {allowInvites && (
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
          {allowInvites ? (
            <>
              <MenuItem onClick={() => console.log("edit")}>Edit</MenuItem>
              <MenuItem>Archive</MenuItem>
              <MenuItem
                color="#E53E3E"
                onClick={() => setdeleteModalOpen(true)}
              >
                Delete
              </MenuItem>
            </>
          ) : (
            <MenuItem color="#E53E3E">Leave</MenuItem>
          )}
        </MenuList>
      </Menu>
    </Flex>
  );
};
