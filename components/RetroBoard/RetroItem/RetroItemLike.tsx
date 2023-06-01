import { useColorModeValue, Button, Text } from "@chakra-ui/react";
import { darken } from "@chakra-ui/theme-tools";
import { useAuthContext } from "context/Auth/AuthContext";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { firestore } from "configs/firebase/firestore";
import LikeSvgIcon from "icons/LikeIcon";
import { useRetroContext } from "context/RetroBoard/RetroBoardContext";
const MAX_LIKES_PER_BOARD = 3;
export const RetroItemLike = ({
  itemId,
  itemUpvotes,
}: {
  itemId: string;
  itemUpvotes: string[];
}) => {
  const bg = useColorModeValue("#f2f2f2", "#0D131A");
  const iconBg = useColorModeValue("#1C2A3A", "#DADADA");
  const borderBg = useColorModeValue("#DADADA", "#1C2A3A");
  const likeHoverBg = useColorModeValue("#ffffff", "#9f9f9f");

  const { user } = useAuthContext();
  const isUpvoted = user && itemUpvotes.includes(user.uid);
  const {
    board: { items },
  } = useRetroContext();

  const upVotes = itemUpvotes.length;
  const toggleUpvote = async () => {
    try {
      if (user) {
        const totalUpvotesOnBoard = items.reduce(
          (totalUpVotes, currentItem) => {
            const userUpvotes = currentItem.itemUpvotes.reduce(
              (count, userId) => (userId === user.uid ? count + 1 : count),
              0
            );
            return userUpvotes + totalUpVotes;
          },
          0
        );

        const itemRef = doc(firestore, "items", itemId);
        const isUpvoted = itemUpvotes.includes(user?.uid);

        if (!isUpvoted && totalUpvotesOnBoard < MAX_LIKES_PER_BOARD) {
          await updateDoc(itemRef, {
            itemUpvotes: arrayUnion(user?.uid),
          });
        } else if (isUpvoted) {
          await updateDoc(itemRef, {
            itemUpvotes: arrayRemove(user?.uid),
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Button
        onClick={toggleUpvote}
        aria-label="Like item"
        size="sm"
        background={isUpvoted ? "#CFFF18" : bg}
        border={`1px solid ${borderBg}`}
        _hover={{
          backgroundColor: isUpvoted
            ? darken("#CFFF18", 12)
            : darken(likeHoverBg, 12),
        }}
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
