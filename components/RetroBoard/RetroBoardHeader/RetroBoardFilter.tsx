import {
  Box,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { updateItemFilter } from "context/RetroBoard/reducers";
import {
  useBoardPref,
  useDispatch,
} from "context/RetroBoard/RetroBoardContext";
import { Controller, useForm } from "react-hook-form";
import { BiSearch } from "react-icons/bi";

type FormInputs = {
  itemFilter: string;
};

export const RetroBoardFilter = () => {
  const { isOpen, onOpen, onClose: closeFilterModal } = useDisclosure();
  const dispatch = useDispatch();
  const { filterString } = useBoardPref();

  const { handleSubmit, control } = useForm<FormInputs>({
    defaultValues: { itemFilter: "" },
  });

  const filterBoardCards = ({ itemFilter }: FormInputs) => {
    dispatch(updateItemFilter(itemFilter.toLowerCase()));
    closeFilterModal();
  };
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  return (
    <>
      {isMobile ? (
        <IconButton aria-label="search" icon={<BiSearch />} onClick={onOpen} />
      ) : (
        <Box>
          <InputGroup borderRadius={5} size="md">
            <InputRightElement
              pointerEvents="none"
              // eslint-disable-next-line react/no-children-prop
              children={<BiSearch color="gray.600" />}
            />
            <Input
              type="text"
              placeholder="Filter..."
              width="95px"
              _focus={{ width: 150 }}
              transition="width 250ms ease-in"
              border="1px solid #949494"
              onChange={(ev) => {
                filterBoardCards({ itemFilter: ev.target.value });
              }}
            />
          </InputGroup>
        </Box>
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
