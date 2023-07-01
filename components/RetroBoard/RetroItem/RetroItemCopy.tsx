import { IconButton, useColorModeValue, useToast } from "@chakra-ui/react";
import { useClipboard } from "hooks/useClipboard";
import { FaRegCopy } from "react-icons/fa";
import { LIGHT_GREEN_COLOR } from "utils/constants";

export const RetroItemCopy = ({ text }: { text: string }) => {
  const [, handleClipBoard] = useClipboard();
  const toast = useToast();
  const bg = useColorModeValue("#f2f2f2", "#0D131A");
  const borderBg = useColorModeValue("#cccccc", "#1C2A3A");
  const fillColor = useColorModeValue("#0D131A", LIGHT_GREEN_COLOR);

  return (
    <IconButton
      onClick={() => {
        handleClipBoard(text);
        toast({
          title: "Copied to clipboard!",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }}
      aria-label="Copy item"
      icon={<FaRegCopy size={16} fill={fillColor} />}
      isRound
      size="sm"
      border={`1px solid ${borderBg}`}
      background={bg}
    />
  );
};
