import { DraggableLocation } from "react-beautiful-dnd";

import { Item, List } from "./interfaces";

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
    position = nextItem.itemOrder - 1;
  } else if (!nextItem) {
    position = prevItem.itemOrder + 1;
  } else {
    position =
      prevItem.itemOrder + (nextItem.itemOrder - prevItem.itemOrder) / 2;
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
  if(!item) return []
  const arrClone = [...arr];
  arrClone.splice(index, 0, item);
  return arrClone;
};

const getPrevAndNextItem = (
  items: Item[],
  source: DraggableLocation,
  destination: DraggableLocation | undefined,
  droppedItemId: string
) => {
  const isSameList = destination?.droppableId === source.droppableId;

  const destItems = items.filter((i) => i.listId === destination?.droppableId);

  const droppedItem = items.find((i) => i.itemId === droppedItemId);

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
  return [...items].sort((a, b) => a.itemOrder - b.itemOrder);
}

export const calculateInitialItemPosition = (items: Item[]): number => {
  const itemPositions = items.map(({ itemOrder }) => itemOrder);
  if (itemPositions.length > 0) {
    return Math.max(...itemPositions) + 1;
  }
  return 1;
};

export const calculateInitialListPosition = (lists: List[]): number => {
  const listPositions = lists.map(({ listOrder }) => listOrder);
  if (listPositions.length > 0) {
    return Math.max(...listPositions) + 1;
  }
  return 1;
};

