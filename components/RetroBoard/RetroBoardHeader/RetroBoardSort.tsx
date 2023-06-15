import { Button, IconButton, useMediaQuery } from "@chakra-ui/react";
import {
  useBoardPref,
  useDispatch,
} from "context/RetroBoard/RetroBoardContext";
import { updateItemsSort } from "context/RetroBoard/reducers";
import { darken } from "@chakra-ui/theme-tools";

import { BiSortAlt2 } from "react-icons/bi";

export const RetroBoardSort = () => {
  const dispatch = useDispatch();

  const { sortByLikes } = useBoardPref();

  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const buttonProp = sortByLikes
    ? {
        backgroundColor: "#CFFF18",
        color: "black",
        _hover: { backgroundColor: darken("#CFFF18", 8) },
      }
    : { colorScheme: "gray" };

  const sortLikes = () => {
    dispatch(updateItemsSort(sortByLikes ? false : true));
  };

  return (
    <>
      {isMobile ? (
        <IconButton
          aria-label="sort"
          icon={<BiSortAlt2 />}
          onClick={sortLikes}
        />
      ) : (
        <Button
          borderRadius="4px"
          leftIcon={<BiSortAlt2 />}
          {...buttonProp}
          onClick={sortLikes}
          fontWeight="normal"
          padding="0px 24px 0px 24px"
          variant="outline"
        >
          Sort
        </Button>
      )}
    </>
  );
};
