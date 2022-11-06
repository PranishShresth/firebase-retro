import { useCallback, useMemo } from "react";
import styled, { css } from "styled-components";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import {
  isPositionChanged,
  calculateItemPosition,
} from "utils/dragAndDropUtils";
import { Box } from "@chakra-ui/layout";
import RetroBoardHeader from "./RetroBoardHeader";
import { useRetroContext } from "context/RetroBoard/RetroBoardContext";
import RetroColumn from "./RetroColumn";
import RetroListHeader from "./RetroList/RetroListHeader";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "configs/firebase/firestore";
import NoPageFound from "components/404page/PageNotFound";
import { RetroBoardSkeleton } from "components/Loader";
import { reorderItem } from "context/RetroBoard/RetroBoardReducer";
import { isEmpty } from "lodash-es";
import { useColorMode } from "@chakra-ui/react";

const ColumnsWrapper = styled.main<{ $isDarkMode: boolean }>`
  display: flex;
  gap: 40px;
  bottom: 0;
  left: 0;
  margin-bottom: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 8px;
  position: absolute;
  right: 0;
  top: 0;
  -webkit-user-select: none;
  user-select: none;

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  /* Track */
  &::-webkit-scrollbar-track-piece {
    background: ${({ $isDarkMode }) => ($isDarkMode ? "#1c2a3a" : "#DADADA")};
    border-radius: 4px;
  }
  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: ${({ $isDarkMode }) => ($isDarkMode ? "#e7ff8e" : "#1c2a3a")};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-button {
    display: block;
    height: 100px;
    width: 4px;
  }
`;

const RetroColumnWrapper = styled.div<{ $listCount: number }>`
  ${({ $listCount }) =>
    $listCount &&
    css`
      width: ${$listCount > 5 ? "300px" : "100%"};
    `}
  height:100%;
  width: 300px;
  display: flex;
  flex-direction: column;
`;

const FlexBox = styled(Box)<{ $listCount: number }>`
  width: 300px;
`;
const RetroBoardCanvas = styled.div`
  flex-grow: 1;
  margin: 0 auto;
  max-width: 1600px;
  position: relative;
  width: calc(100% - 50px);
`;
export const RetroBoardSingle = () => {
  const {
    board: { items, lists, board, status },
    dispatch,
  } = useRetroContext();
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  const currentListCount = lists.length;

  const sortedList = useMemo(() => {
    return lists.sort((a, b) => a.listOrder - b.listOrder);
  }, [lists]);

  const onDragStart = useCallback(() => {
    console.log("draggin");
    /*...*/
  }, []);

  const onDragEnd = useCallback(
    async (result: DropResult) => {
      const { source, destination, draggableId } = result;
      if (!isPositionChanged(source, destination)) return;
      if (!destination) return;
      const position = calculateItemPosition(
        items,
        source,
        destination,
        draggableId
      );

      const itemRef = doc(firestore, "items", draggableId);

      dispatch(
        reorderItem({
          source: source.droppableId,
          destination: destination.droppableId,
          itemId: draggableId,
          position,
        })
      );

      await updateDoc(itemRef, {
        itemOrder: position,
        listId: destination.droppableId,
      });
    },
    [items, dispatch]
  );

  if (status == "pending") {
    return <RetroBoardSkeleton />;
  }

  if (isEmpty(board)) {
    return <NoPageFound />;
  }

  return (
    <>
      <RetroBoardHeader />
      <RetroBoardCanvas>
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <ColumnsWrapper id="#board" $isDarkMode={isDarkMode}>
            {sortedList?.map((list) => {
              return (
                <FlexBox key={list.listId} $listCount={currentListCount}>
                  <RetroColumnWrapper $listCount={currentListCount}>
                    <RetroListHeader
                      listColour={list?.listColour}
                      listId={list.listId}
                      listTitle={list.listTitle}
                    />
                    <Droppable droppableId={list.listId} key={list.listId}>
                      {(provided) => (
                        <RetroColumn
                          droppableProvided={provided}
                          listColour={list?.listColour}
                          listId={list.listId}
                        />
                      )}
                    </Droppable>
                  </RetroColumnWrapper>
                </FlexBox>
              );
            })}
          </ColumnsWrapper>
        </DragDropContext>
      </RetroBoardCanvas>
    </>
  );
};
