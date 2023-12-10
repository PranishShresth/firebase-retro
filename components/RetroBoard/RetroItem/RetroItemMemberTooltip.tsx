import { Avatar, Tooltip } from "@chakra-ui/react";
import { useBoard } from "context/RetroBoard/RetroBoardContext";

export const RetroItemMemberToolTip = ({
  avatarSize,
  userId,
}: {
  avatarSize: string;
  userId: string;
}) => {
  const {
    board: {
      board: { members },
    },
  } = useBoard();

  const member = members.find((_) => _.userId === userId);
  if (!member) return null;

  const label = `${member.firstName} ${member.lastName}`;
  return (
    <div>
      <Tooltip bg="gray.300" color="black" hasArrow label={label}>
        <Avatar size={avatarSize} name={label} />
      </Tooltip>
    </div>
  );
};
