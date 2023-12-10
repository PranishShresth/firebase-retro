import { IconButton, useColorModeValue } from "@chakra-ui/react";
import EditIcon from "icons/EditIcon";
import { LIGHT_GREEN_COLOR } from "utils/constants";

export const RetroCommentEdit = ({
  openEditBox,
}: {
  openEditBox: () => void;
}) => {
  const bg = useColorModeValue("#f2f2f2", "#0D131A");
  const borderBg = useColorModeValue("#DADADA", "#1C2A3A");
  const fillColor = useColorModeValue("#0D131A", LIGHT_GREEN_COLOR);

  return (
    <>
      <IconButton
        onClick={openEditBox}
        aria-label="Edit Comment"
        icon={<EditIcon fill={fillColor} width={12} height={12} />}
        isRound
        size="xs"
        border={`1px solid ${borderBg}`}
        background={bg}
      />
    </>
  );
};
