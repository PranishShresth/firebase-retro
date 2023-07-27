import { IconButton, Tooltip } from "@chakra-ui/react";
import { darken } from "@chakra-ui/theme-tools";
import { firestore } from "configs/firebase/firestore";
import { useAuthContext } from "context/Auth/AuthContext";
import { useBoard } from "context/RetroBoard/RetroBoardContext";
import { doc, setDoc } from "firebase/firestore";
import { AiOutlineEye } from "react-icons/ai";
import { LIGHT_GREEN_COLOR } from "utils/constants";

export const RetroVisibility = () => {
  const {
    board: { board },
  } = useBoard();
  const { user } = useAuthContext();

  const itemsHidden = board.prefs.hideItems;

  const allowVisibilityControl = user?.uid === board.userId;

  const buttonProp = itemsHidden
    ? {
        backgroundColor: LIGHT_GREEN_COLOR,
        color: "black",
        _hover: { backgroundColor: darken(LIGHT_GREEN_COLOR, 8) },
      }
    : { colorScheme: "gray" };

  const hideItems = async () => {
    const ref = doc(firestore, "boards", board.boardId);
    try {
      await setDoc(
        ref,
        {
          prefs: {
            hideItems: !itemsHidden,
          },
        },
        { merge: true }
      );
    } catch {}
  };

  if (!allowVisibilityControl) return null;

  return (
    <Tooltip
      bg="gray.300"
      color="black"
      hasArrow
      label={"Hide items created by others"}
    >
      <IconButton
        variant="outline"
        aria-label="Hide items"
        {...buttonProp}
        icon={<AiOutlineEye fill={itemsHidden ? "black" : "#F2F2F2"} />}
        onClick={hideItems}
      />
    </Tooltip>
  );
};
