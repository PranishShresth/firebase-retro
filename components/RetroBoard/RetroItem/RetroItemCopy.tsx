import { IconButton, useColorModeValue, useToast } from "@chakra-ui/react";
import { useClipboard } from "hooks/useClipboard";
import { FaRegCopy } from "react-icons/fa";

export const RetroItemCopy = ({ text }: { text: string }) => {
  const [, handleClipBoard] = useClipboard();
  const toast = useToast();
  const bg = useColorModeValue("#f2f2f2", "#0D131A");
  const outlineBg = useColorModeValue("#cccccc", "#1C2A3A");

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
      icon={<FaRegCopy size={16} />}
      isRound
      size="sm"
      outline={`1px solid ${outlineBg}`}
      background={bg}
    />
  );
};
