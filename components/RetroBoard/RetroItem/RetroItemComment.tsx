import { Button, Text, useColorModeValue } from "@chakra-ui/react";
import { darken } from "@chakra-ui/theme-tools";
import { FaRegCommentDots } from "react-icons/fa";
import { LIGHT_GREEN_COLOR } from "utils/constants";
import { Comment } from "utils/interfaces";

export const RetroItemComment = ({
  isCommentsExpanded,
  itemId,
  itemComments,
  toggleComments,
}: {
  isCommentsExpanded: boolean;
  itemId: string;
  itemComments: Comment[];
  toggleComments: () => void;
}) => {
  const bg = useColorModeValue("#f2f2f2", "#0D131A");
  const iconBg = useColorModeValue("#1C2A3A", LIGHT_GREEN_COLOR);
  const borderBg = useColorModeValue("#DADADA", "#1C2A3A");
  const likeHoverBg = useColorModeValue("#ffffff", "#9f9f9f");
  const comments = itemComments.length;

  return (
    <>
      <Button
        onClick={toggleComments}
        aria-label="Comments"
        size="sm"
        background={isCommentsExpanded ? "#CFFF18" : bg}
        border={`1px solid ${borderBg}`}
        _hover={{
          backgroundColor: isCommentsExpanded
            ? darken("#CFFF18", 12)
            : darken(likeHoverBg, 12),
        }}
        borderRadius={16.5}
        color={isCommentsExpanded ? "#000000" : "#ffffff"}
        lineHeight={24}
        position={"relative"}
      >
        {!!comments && (
          <Text
            color={isCommentsExpanded ? "#000000" : iconBg}
            fontSize={15}
            fontWeight={700}
            lineHeight="0"
            marginRight="4px"
          >
            {comments}
          </Text>
        )}
        <FaRegCommentDots fill={isCommentsExpanded ? "#000000" : iconBg} />
      </Button>
    </>
  );
};
