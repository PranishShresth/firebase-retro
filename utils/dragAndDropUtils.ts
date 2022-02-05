import { DraggableLocation } from "react-beautiful-dnd";

import { Item } from "./interfaces";

export const isPositionChanged = (
  source: DraggableLocation,
  destination: DraggableLocation | undefined
) => {
  if (!destination) return false;
  const isSameList = destination.droppableId === source.droppableId;
  const isSamePosition = destination.index === source.index;
  return !isSameList || !isSamePosition;
};

export const calculateItemPosition = (
  items: Item[],
  source: DraggableLocation,
  destination: DraggableLocation | undefined,
  droppedItemId: string
) => {
  const { prevItem, nextItem } = getPrevAndNextItem(
    items,
    source,
    destination,
    droppedItemId
  );
  let position;

  if (!prevItem && !nextItem) {
    position = 1;
  } else if (!prevItem) {
    position = nextItem.item_order - 1;
  } else if (!nextItem) {
    position = prevItem.item_order + 1;
  } else {
    position =
      prevItem.item_order + (nextItem.item_order - prevItem.item_order) / 2;
  }
  return position;
};

const moveItemWithinArray = (
  arr: Item[],
  item: Item | undefined,
  newIndex: number
) => {
  const arrClone = [...arr];
  const oldIndex = arrClone.indexOf(item!);
  arrClone.splice(newIndex, 0, arrClone.splice(oldIndex, 1)[0]);
  return arrClone;
};

const insertItemIntoArray = (
  arr: Item[],
  item: Item | undefined,
  index: number
) => {
  const arrClone = [...arr];
  arrClone.splice(index, 0, item!);
  return arrClone;
};

const getPrevAndNextItem = (
  items: Item[],
  source: DraggableLocation,
  destination: DraggableLocation | undefined,
  droppedItemId: string
) => {
  const isSameList = destination?.droppableId === source.droppableId;

  const destItems = items.filter((i) => i.list_id === destination?.droppableId);

  const droppedItem = items.find((i) => i.item_id === droppedItemId);

  const destSortedItems = getSortedItems(destItems);
  const afterDropDestinationItems = isSameList
    ? moveItemWithinArray(destSortedItems, droppedItem, destination!.index)
    : insertItemIntoArray(destSortedItems, droppedItem, destination!.index);

  const prevItem = afterDropDestinationItems[destination!.index - 1];
  const nextItem = afterDropDestinationItems[destination!.index + 1];

  return { prevItem, nextItem };
};

function getSortedItems(items: Item[] | undefined) {
  if (!items) return [];
  return [...items].sort((a, b) => a.item_order - b.item_order);
}
