import { Box, useColorModeValue } from "@chakra-ui/react";
import { AlertDialogBar } from "components/Alert";
import React from "react";
import { useDisclosure } from "@chakra-ui/react";
import { doc, deleteDoc, writeBatch } from "firebase/firestore";
import { firestore } from "configs/firebase/firestore";
import { useRetroContext } from "context/RetroBoard/RetroBoardContext";
import DeleteIcon from "icons/DeleteIcon";

interface Props {
  listId: string;
}

export const RetroListDelete = ({ listId }: Props) => {
  const {
    isOpen: isDeleteDialogOpen,
    onClose: closeDeleteDialog,
    onOpen: openDeleteDialog,
  } = useDisclosure();
  const {
    board: { items },
  } = useRetroContext();

  const bg = useColorModeValue("#1C2A3A", "#F2F2F2");

  const deleteList = async () => {
    try {
      const listRef = doc(firestore, "lists", listId);
      const batch = writeBatch(firestore);
      const allListItems = items.filter((item) => item.listId === listId);
      allListItems.forEach((item) => {
        const ref = doc(firestore, "items", item.itemId);
        batch.delete(ref);
      });
      await batch.commit();
      deleteDoc(listRef);
    } catch {
      console.log("err");
    }
  };

  return (
    <>
      <Box onClick={openDeleteDialog} cursor="pointer">
        <DeleteIcon fill={bg} />
      </Box>
      <AlertDialogBar
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onClick={deleteList}
        title="Delete Column"
        ariaLabel="Delete List Dialogue"
      />
    </>
  );
};

// const RetroListMenu = ({ listId }: Props) => {
//   const bg = useColorModeValue("gray.600", "white");
//   const {
//     isOpen: isDeleteDialogOpen,
//     onClose: closeDeleteDialog,
//     onOpen: openDeleteDialog,
//   } = useDisclosure();
//   const {
//     board: { items },
//   } = useRetroContext();
//   const {
//     isOpen: isMoveModalOpen,
//     onClose: closeMoveModal,
//     onOpen: openMoveModal,
//   } = useDisclosure();

//   const deleteList = async () => {
//     try {
//       const listRef = doc(firestore, "lists", listId);
//       const batch = writeBatch(firestore);
//       const allListItems = items.filter((item) => item.listId === listId);
//       allListItems.forEach((item) => {
//         const ref = doc(firestore, "items", item.itemId);
//         batch.delete(ref);
//       });
//       await batch.commit();
//       deleteDoc(listRef);
//     } catch {
//       console.log("err");
//     }
//   };

//   return (
//     <>
//       <Menu>
//         <MenuButton
//           as={IconButton}
//           aria-label="Options"
//           icon={<FiMoreVertical />}
//           color={bg}
//         ></MenuButton>
//         <MenuList color={bg}>
//           <MenuOptionGroup defaultValue="asc" title="Order" type="radio">
//             <MenuItemOption fontSize="sm" value="asc">
//               Ascending
//             </MenuItemOption>
//             <MenuItemOption fontSize="sm" value="desc">
//               Descending
//             </MenuItemOption>
//           </MenuOptionGroup>
//           <MenuItem fontSize="sm" onClick={openMoveModal}>
//             Include column in:
//           </MenuItem>
//           <MenuItem color="#E53E3E" fontSize="sm" onClick={openDeleteDialog}>
//             Delete
//           </MenuItem>
//         </MenuList>
//       </Menu>

//       <MoveListContainer
//         isMoveModalOpen={isMoveModalOpen}
//         closeMoveModal={closeMoveModal}
//         openMoveModal={openMoveModal}
//         listId={listId}
//       />
//       <AlertDialogBar
//         isOpen={isDeleteDialogOpen}
//         onClose={closeDeleteDialog}
//         onClick={deleteList}
//         title="Delete Column"
//         ariaLabel="Delete List Dialogue"
//       />
//     </>
//   );
// };

// const MoveListContainer = ({
//   isMoveModalOpen,
//   closeMoveModal,
//   openMoveModal,
//   listId,
// }: {
//   isMoveModalOpen: boolean;
//   closeMoveModal: () => void;
//   openMoveModal: () => void;
//   listId: string;
// }) => {
//   const {
//     board: { allBoards, items, lists },
//   } = useRetroContext();
//   const toast = useToast();

//   const [loading, setLoading] = useState(false);
//   const { getValues, control } = useForm<{ boardId: string }>({
//     defaultValues: {
//       boardId: "",
//     },
//   });

//   const copyListToAnotherBoard = async () => {
//     const boardId = getValues("boardId");
//     if (boardId === "") return;
//     const allItems = items.filter((item) => item.listId === listId);
//     const list = lists.find((list) => list.listId === listId);
//     if (!list) return;

//     try {
//       const listId = uuidV4();
//       setLoading(true);
//       const batch = writeBatch(firestore);

//       allItems.forEach((item) => {
//         const i_id = uuidV4();
//         batch.set(doc(firestore, "items", i_id), {
//           ...item,
//           boardId: boardId,
//           itemId: i_id,
//           listId: listId,
//         });
//       });

//       await setDoc(doc(firestore, "lists", listId), {
//         ...list,
//         boardId: boardId,
//         listId: listId,
//       });
//       await batch.commit();

//       setLoading(false);
//       toast({
//         title: "List Added.",
//         description: `The list has been included...`,
//         status: "success",
//         duration: 4000,
//         isClosable: true,
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <MoveModal
//       modalTitle="Include this list in"
//       isOpen={isMoveModalOpen}
//       onClose={closeMoveModal}
//       onOpen={openMoveModal}
//     >
//       <Stack direction="column" spacing={5}>
//         <Controller
//           control={control}
//           name="boardId"
//           render={({ field }) => (
//             <Select placeholder="Lists..." {...field}>
//               {allBoards.slice(0, 6)?.map((board) => (
//                 <option key={board.boardId} value={board.boardId}>
//                   {board.boardTitle}
//                 </option>
//               ))}
//             </Select>
//           )}
//         />

//         <Box onClick={throttle(copyListToAnotherBoard, 4000)}>
//           <Button isLoading={loading} isFullWidth={false}>
//             Add
//           </Button>
//         </Box>
//       </Stack>
//     </MoveModal>
//   );
// };

// export default RetroListMenu;
