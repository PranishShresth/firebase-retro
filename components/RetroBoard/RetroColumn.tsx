import { useBoard, useBoardPref } from "context/RetroBoard/RetroBoardContext";
import React, { useMemo } from "react";
import { Draggable, DroppableProvided } from "react-beautiful-dnd";
import styled from "styled-components";
import AddItem from "./RetroItem/AddItem";
import RetroCard from "./RetroItem/RetroItem";

const BottomListButton = styled.div`
  margin-top: 10px;
`;

interface Props {
  listColour: string;
  listId: string;
  children?: React.ReactNode;
  droppableProvided?: DroppableProvided;
}

const RetroColumn = ({ listColour, listId, droppableProvided }: Props) => {
  const {
    board: { items },
  } = useBoard();

  const { filterString, sortByLikes } = useBoardPref();

  const memoizedListItems = useMemo(() => {
    return items
      .filter((item) => item.listId === listId)
      .filter((item) => item.itemTitle.toLowerCase().includes(filterString))
      .sort((a, b) =>
        sortByLikes
          ? b.itemUpvotes.length - a.itemUpvotes.length
          : a.itemOrder - b.itemOrder
      );
  }, [items, listId, filterString, sortByLikes]);

  return (
    <>
      <RetroCardContainer ref={droppableProvided?.innerRef}>
        {memoizedListItems.map((item, index) => {
          return (
            <Draggable
              draggableId={item.itemId}
              index={index}
              key={item.itemId}
            >
              {(provided, snapshot) => (
                <RetroCard
                  listColour={listColour}
                  provided={provided}
                  snapshot={snapshot}
                  item={item}
                />
              )}
            </Draggable>
          );
        })}

        {droppableProvided?.placeholder}
      </RetroCardContainer>
      <BottomListButton>
        <AddItem listId={listId} />
      </BottomListButton>
    </>
  );
};

const RetroCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 1px;
  min-height: 2px;
  max-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgb(0 0 0 / 10%);
  }
`;

export default RetroColumn;
