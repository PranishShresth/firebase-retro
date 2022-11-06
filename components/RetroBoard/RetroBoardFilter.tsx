import {
  Button,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { useRetroContext } from "context/RetroBoard/RetroBoardContext";
import { setFilterPayload } from "context/RetroBoard/RetroBoardReducer";
import { Controller, useForm } from "react-hook-form";
import { BiSearch } from "react-icons/bi";

type FormInputs = {
  itemFilter: string;
};

export const RetroBoardFilter = () => {
  const { isOpen, onOpen, onClose: closeFilterModal } = useDisclosure();
  const { dispatch } = useRetroContext();
  const {
    board: { filterPayload },
  } = useRetroContext();
  const isFilterApplied = filterPayload !== "";
  const { handleSubmit, control } = useForm<FormInputs>({
    defaultValues: { itemFilter: "" },
  });

  const filterBoardCards = ({ itemFilter }: FormInputs) => {
    dispatch(setFilterPayload(itemFilter.toLowerCase()));
    closeFilterModal();
  };
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const buttonProp = isFilterApplied
    ? { backgroundColor: "#2bc0c1", color: "white", _hover: { bg: "#2C7A7B" } }
    : { colorScheme: "gray" };

  return (
    <>
      {isMobile ? (
        <IconButton aria-label="search" icon={<BiSearch />} onClick={onOpen} />
      ) : (
        <Button
          borderRadius="4px"
          leftIcon={<BiSearch />}
          {...buttonProp}
          onClick={onOpen}
          padding="0px 24px 0px 24px"
          variant="outline"
        >
          Search
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={closeFilterModal}>
        <ModalOverlay />
        <ModalContent margin="3.75rem 1rem">
          <form onSubmit={handleSubmit(filterBoardCards)}>
            <InputGroup>
              <InputLeftElement
                height="100%"
                padding="0 10px"
                pointerEvents="none"
              >
                <Icon as={BiSearch} width={5} height={5} color="teal" />
              </InputLeftElement>
              <Controller
                control={control}
                name="itemFilter"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Search for an item..."
                    size="lg"
                    height="56px"
                    paddingLeft="36px"
                    fontWeight="medium"
                    border="none"
                  />
                )}
              />
            </InputGroup>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
