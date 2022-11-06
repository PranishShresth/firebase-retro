import { useColorModeValue, Button, Text } from "@chakra-ui/react";
import { darken } from "@chakra-ui/theme-tools";
import { useAuthContext } from "context/Auth/AuthContext";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { firestore } from "configs/firebase/firestore";
import LikeSvgIcon from "icons/LikeIcon";

export const RetroItemLike = ({
  itemId,
  itemUpvotes,
}: {
  itemId: string;
  itemUpvotes: string[];
}) => {
  const bg = useColorModeValue("#f2f2f2", "#0D131A");
  const iconBg = useColorModeValue("#1C2A3A", "#DADADA");
  const outlineBg = useColorModeValue("#DADADA", "#1C2A3A");

  const { user } = useAuthContext();
  const isUpvoted = user && itemUpvotes.includes(user.uid);
  const upVotes = itemUpvotes.length;
  const toggleUpvote = async () => {
    if (user) {
      const itemRef = doc(firestore, "items", itemId);
      if (!itemUpvotes.includes(user?.uid)) {
        await updateDoc(itemRef, {
          itemUpvotes: arrayUnion(user?.uid),
        });
      } else {
        await updateDoc(itemRef, {
          itemUpvotes: arrayRemove(user?.uid),
        });
      }
    }
  };

  return (
    <>
      <Button
        onClick={toggleUpvote}
        aria-label="Like item"
        size="sm"
        background={isUpvoted ? "#CFFF18" : bg}
        outline={`1px solid ${outlineBg}`}
        _hover={{ backgroundColor: darken("#CFFF18", 12) }}
        isRound
        borderRadius={16.5}
        color={isUpvoted ? "#000000" : "#ffffff"}
        lineHeight={24}
      >
        {!!upVotes && (
          <Text
            color={isUpvoted ? "#000000" : iconBg}
            fontSize={15}
            fontWeight={700}
            lineHeight="0"
            marginRight="3px"
          >
            {upVotes}
          </Text>
        )}
        <LikeSvgIcon fill={isUpvoted ? "#000000" : iconBg} />
      </Button>
    </>
  );
};
