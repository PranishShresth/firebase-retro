import { IconButton, useColorModeValue } from "@chakra-ui/react";
import EditIcon from "icons/EditIcon";

export const RetroItemEdit = ({ openEditBox }: { openEditBox: () => void }) => {
  const bg = useColorModeValue("#f2f2f2", "#0D131A");
  const iconBg = useColorModeValue("#1C2A3A", "#DADADA");
  const outlineBg = useColorModeValue("#DADADA", "#1C2A3A");

  return (
    <>
      <IconButton
        onClick={openEditBox}
        aria-label="Edit item"
        icon={<EditIcon fill={iconBg} />}
        isRound
        size="sm"
        outline={`1px solid ${outlineBg}`}
        background={bg}
      />
    </>
  );
};
