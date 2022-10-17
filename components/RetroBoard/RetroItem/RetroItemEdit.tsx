import Image from "next/image";
import { IconButton } from "@chakra-ui/react";

export const RetroItemEdit = ({ openEditBox }: { openEditBox: () => void }) => {
  return (
    <>
      <IconButton
        onClick={openEditBox}
        aria-label="Edit item"
        icon={<Image width={14} height={14} src="/Edit.svg" alt="delete" />}
        isRound
        size="xs"
        background="#0D131A"
      />
    </>
  );
};
