import { useColorModeValue, Button, Text } from "@chakra-ui/react";
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
  const bg = useColorModeValue("black", "gray.600");

  const lightOrDarkStarBg = useColorModeValue("#F91880", "#FBBD08");
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
        size="xs"
        width="49px"
        background={isUpvoted ? "#CFFF18" : "#0D131A"}
        isRound
        borderRadius={16.5}
        color={isUpvoted ? "#000000" : "#ffffff"}
        lineHeight={24}
      >
        {!!upVotes && (
          <Text fontSize={15} fontWeight={700}>
            {upVotes}
          </Text>
        )}
        <LikeSvgIcon fill={isUpvoted ? "#000000" : "#ffffff"} />
      </Button>
    </>
  );
};
