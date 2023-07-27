import { IconButton, Tooltip } from "@chakra-ui/react";
import { darken } from "@chakra-ui/theme-tools";
import { updateItemsSort } from "context/RetroBoard/reducers";
import {
  useBoardPref,
  useDispatch,
} from "context/RetroBoard/RetroBoardContext";
import { BiSortAlt2 } from "react-icons/bi";
import { LIGHT_GREEN_COLOR } from "utils/constants";

export const RetroBoardSort = () => {
  const dispatch = useDispatch();

  const { sortByLikes } = useBoardPref();

  const buttonProp = sortByLikes
    ? {
        backgroundColor: LIGHT_GREEN_COLOR,
        color: "black",
        _hover: { backgroundColor: darken(LIGHT_GREEN_COLOR, 8) },
      }
    : { colorScheme: "gray" };

  const sortLikes = () => {
    dispatch(updateItemsSort(sortByLikes ? false : true));
  };

  return (
    <Tooltip
      bg="gray.300"
      color="black"
      hasArrow
      label={"Sort by most upvotes"}
    >
      <IconButton
        aria-label="sort"
        {...buttonProp}
        icon={<BiSortAlt2 />}
        onClick={sortLikes}
        variant="outline"
      />
    </Tooltip>
  );
};
