import { IconButton } from "@chakra-ui/react";
import EditIcon from "icons/EditIcon";

export const RetroItemEdit = ({ openEditBox }: { openEditBox: () => void }) => {
  return (
    <>
      <IconButton
        onClick={openEditBox}
        aria-label="Edit item"
        icon={<EditIcon fill="#F2F2F2" />}
        isRound
        size="xs"
        background="#0D131A"
      />
    </>
  );
};
