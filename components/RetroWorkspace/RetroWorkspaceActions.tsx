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
import { useAuthContext } from "context/Auth/AuthContext";
import Link from "next/link";
import { FaEllipsisV } from "react-icons/fa";
import styled from "styled-components";
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
}
export const RetroWorkspaceActions = ({
  members,
  openMemberSelect: pushOpenMemberSelect,
  userId,
}: RetroWorkspaceActionsProps) => {
  const { member } = useAuthContext();
  const allowInvites = member?.userId === userId;

  return (
    <Flex alignItems="center">
      {members.slice(0, MEMBER_ICON_LIMIT).map((member) => {
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
      {members.length > MEMBER_ICON_LIMIT && (
        <Link href="javascript:void(0)" passHref>
          <StyledLink>View all</StyledLink>
        </Link>
      )}
      {allowInvites && (
        <Button marginLeft="8px" onClick={pushOpenMemberSelect}>
          Invite
        </Button>
      )}
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
          <MenuItem onClick={() => console.log("edit")}>Edit</MenuItem>
          <MenuItem>Archive</MenuItem>
          <MenuItem onClick={() => console.log("delete")}>Delete</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};
