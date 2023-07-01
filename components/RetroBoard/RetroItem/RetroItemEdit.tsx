import { IconButton, useColorModeValue } from "@chakra-ui/react";
import EditIcon from "icons/EditIcon";
import { LIGHT_GREEN_COLOR } from "utils/constants";

export const RetroItemEdit = ({ openEditBox }: { openEditBox: () => void }) => {
  const bg = useColorModeValue("#f2f2f2", "#0D131A");
  const borderBg = useColorModeValue("#DADADA", "#1C2A3A");
  const fillColor = useColorModeValue("#0D131A", LIGHT_GREEN_COLOR);

  return (
    <>
      <IconButton
        onClick={openEditBox}
        aria-label="Edit item"
        icon={<EditIcon fill={fillColor} />}
        isRound
        size="sm"
        border={`1px solid ${borderBg}`}
        background={bg}
      />
    </>
  );
};
