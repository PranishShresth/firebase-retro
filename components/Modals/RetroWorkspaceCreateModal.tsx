import {
  Box,
  Input,
  InputGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Button,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { darken } from "@chakra-ui/theme-tools";
import { firestore } from "configs/firebase/firestore";
import { useAuthContext } from "context/Auth/AuthContext";
import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useForm } from "react-hook-form";
import { FiSend } from "react-icons/fi";
import { Collection } from "utils/firebaseCollection";
import { Workspace } from "utils/interfaces";
import { uuidV4 } from "utils/uuidV4";

interface WorkspaceFormValues {
  description: string;
  workspaceName: string;
}

export const RetroWorkspaceCreateModal = ({
  addWorkspace,
}: {
  addWorkspace: (workspace: Workspace) => void;
}) => {
  const { member } = useAuthContext();
  const {
    isOpen,
    onClose: closeWorkspaceCreate,
    onOpen: openWorkspaceCreate,
  } = useDisclosure();

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<WorkspaceFormValues>({ mode: "onChange" });
  const toast = useToast();

  const handleCreateWorkspace = async (data: WorkspaceFormValues) => {
    try {
      if (member) {
        const userRef = doc(firestore, Collection.Users, member.userId);
        const workspaceId = uuidV4();
        const workspaceRef = doc(firestore, Collection.Workspaces, workspaceId);

        await updateDoc(userRef, {
          workspaces: arrayUnion(workspaceId),
        });

        await setDoc(workspaceRef, {
          workspaceDescription: data.description,
          workspaceId,
          workspaceTitle: data.workspaceName,
          userId: member.userId,
          members: [member],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        const updatedWorkspace = (await (
          await getDoc(doc(firestore, Collection.Workspaces, workspaceId))
        ).data()) as Workspace;

        addWorkspace(updatedWorkspace);
        closeWorkspaceCreate();
        reset();

        toast({
          title: "Workspace Created Successfully",
          description:
            "You can now create boards and invite others to your workspace",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Box>
        <Button
          backgroundColor={"#00B5AD"}
          color={"white"}
          onClick={openWorkspaceCreate}
          _hover={{ backgroundColor: darken("#00B5AD", 8) }}
        >
          Create Workspace&nbsp;
          <FiSend />
        </Button>
      </Box>
      <Modal isOpen={isOpen} onClose={closeWorkspaceCreate}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Workspace</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(handleCreateWorkspace)}>
              <Stack spacing={3}>
                <div>
                  <span>Workspace Name:</span>
                  <InputGroup marginTop="4px">
                    <Input
                      placeholder="Workspace Name"
                      required
                      type="text"
                      {...register("workspaceName", { required: true })}
                    />
                  </InputGroup>
                </div>
                <div>
                  <span>Description:</span>
                  <InputGroup marginTop="4px">
                    <Input
                      placeholder="Description"
                      required
                      type="text"
                      {...register("description", { required: true })}
                    />
                  </InputGroup>
                </div>
                <div>
                  <Button
                    backgroundColor={"#00B5AD"}
                    color={"white"}
                    disabled={!isDirty || !isValid}
                    marginBottom="12px"
                    marginTop="16px"
                    type="submit"
                    width="100%"
                    _hover={{ backgroundColor: darken("#00B5AD", 8) }}
                  >
                    Create Workspace&nbsp;
                    <FiSend />
                  </Button>
                </div>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
