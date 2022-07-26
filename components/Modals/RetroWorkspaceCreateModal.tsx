import {
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
import { firestore } from "configs/firebase/firestore";
import { useAuthContext } from "context/Auth/AuthContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useForm } from "react-hook-form";
import { Collection } from "utils/firebaseCollection";
import { uuidV4 } from "utils/uuidV4";

interface WorkspaceFormValues {
  description: string;
  workspaceName: string;
}

export const RetroWorkspaceCreateModal = () => {
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
    formState: { errors },
  } = useForm<WorkspaceFormValues>({});
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
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
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
      <Button onClick={openWorkspaceCreate}>Create Workspace</Button>
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
                      {...register("workspaceName")}
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
                      {...register("description")}
                    />
                  </InputGroup>
                </div>
                <div>
                  <Button marginBottom="12px" type="submit">
                    Create Workspace
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
