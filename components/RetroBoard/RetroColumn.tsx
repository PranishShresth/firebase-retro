import React, { memo, useMemo } from "react";
import styled from "styled-components";
import RetroCard from "./RetroCard";
// import { Item } from "../interfaces";
// import AddItem from "./Item/AddItem";
import { Draggable, DroppableProvided } from "react-beautiful-dnd";
import { Item } from "utils/interfaces";
import { useRetroContext } from "context/RetroBoard/RetroBoardContext";
import AddItem from "./RetroItem/AddItem";

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

const BottomListButton = styled.div`
  margin-top: 10px;
`;

interface Props {
  list_id: string;
  children?: React.ReactNode;
  droppableProvided?: DroppableProvided;
}

const RetroColumn = ({ list_id, droppableProvided }: Props) => {
  const {
    board: { items },
  } = useRetroContext();

  const memoizedListItems = useMemo(() => {
    return items
      .filter((item) => item.list_id === list_id)
      .sort((a, b) => a.item_order - b.item_order);
  }, [items, list_id]);

  return (
    <>
      <RetroCardContainer ref={droppableProvided?.innerRef}>
        {memoizedListItems.map((item, index) => {
          return (
            <Draggable
              draggableId={item.item_id}
              index={index}
              key={item.item_id}
            >
              {(provided, snapshot) => (
                <RetroCard
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
        <AddItem list_id={list_id} />
      </BottomListButton>
    </>
  );
};

export default RetroColumn;
