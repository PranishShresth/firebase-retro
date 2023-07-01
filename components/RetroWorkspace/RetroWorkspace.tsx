import {
  Box,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import DualRingLoader from "components/Loader/DualRingLoader";
import { RetroMemberSelectModal } from "components/Modals/RetroMemberSelectModal";
import { RetroWorkspaceCreateModal } from "components/Modals/RetroWorkspaceCreateModal";
import NoWorkspaces from "components/NoWorkspaces/NoWorkspaces";
import { RetroBody } from "components/RetroHome";
import { firestore } from "configs/firebase/firestore";
import { useAuthContext } from "context/Auth/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Collection } from "utils/firebaseCollection";
import { Workspace } from "utils/interfaces";

const StyledFlex = styled(Flex)`
  left: 50%;
  max-width: 700px;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -65%);
  width: 100%;
`;

export const RetroWorkspace = () => {
  const { member } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const workspaceBg = useColorModeValue("white", "#141E29");

  const addWorkspace = (workspace: Workspace) => {
    setWorkspaces((prev) => [...prev, workspace]);
  };
  const updateWorkspace = (workspace: Workspace) => {
    const idx = workspaces.findIndex(
      (w) => w.workspaceId === workspace.workspaceId
    );
    if (idx > -1) {
      const wspaces = [...workspaces];
      wspaces[idx] = workspace;
      setWorkspaces(wspaces);
    }
  };

  const removeWorkspace = (workspaceId: string) => {
    setWorkspaces((prev) => prev.filter((w) => w.workspaceId !== workspaceId));
  };

  useEffect(() => {
    if (member) {
      const workspaces = member.workspaces;
      const promises = workspaces.map((id) =>
        getDoc(doc(firestore, Collection.Workspaces, id))
      );
      Promise.all(promises).then((workspace) => {
        setWorkspaces(workspace.map((_) => _.data() as Workspace));

        setIsLoading(false);
      });
    }
  }, [member]);

  if (isLoading) {
    return (
      <Box height={"100%"} width={"100%"}>
        <DualRingLoader />
      </Box>
    );
  }

  return (
    <Box margin={"0 auto"} maxWidth={"1536px"} height="100%">
      {workspaces.length === 0 ? (
        <StyledFlex flexDirection="column" alignItems="center">
          <NoWorkspaces />
          <RetroWorkspaceCreateModal addWorkspace={addWorkspace} />
        </StyledFlex>
      ) : (
        <>
          <Stack direction="column" height="100%">
            <Box maxW="32rem" padding={{ base: 4 }}>
              <Heading mb={4} mt={4}>
                Welcome back {member?.firstName}!
              </Heading>
              <Text fontSize="md" mb={4}>
                Reflect. Learn. Improve. Retrospect with Ease!
              </Text>
              <Text fontSize="md" mb={4}>
                To start off, would you like to create workspace ?
              </Text>
              <RetroWorkspaceCreateModal addWorkspace={addWorkspace} />
            </Box>
            <Box flex="1" padding={{ base: 4 }}>
              {workspaces?.map(
                ({ workspaceId, workspaceTitle, userId, members }) => (
                  <Box
                    backgroundColor={workspaceBg}
                    borderRadius="8px"
                    key={workspaceId}
                    margin="1.5rem 0"
                    padding="16px 16px 24px 24px"
                    boxShadow="4px 4px 16px 8px rgba(0,0,0,0.32)"
                  >
                    <Flex
                      alignItems="center"
                      justifyContent="space-between"
                      direction={{ base: "column", md: "row" }}
                      gap={{ base: 4, md: 0 }}
                    >
                      <Heading as="h2" size="md">
                        {workspaceTitle}
                      </Heading>
                      <RetroMemberSelectModal
                        members={members}
                        removeWorkspace={removeWorkspace}
                        updateWorkspace={updateWorkspace}
                        userId={userId}
                        workspaceId={workspaceId}
                        workspaceTitle={workspaceTitle}
                      />
                    </Flex>
                    <RetroBody
                      workspaceId={workspaceId}
                      workspaceName={workspaceTitle}
                    />
                  </Box>
                )
              )}
            </Box>
          </Stack>
        </>
      )}
    </Box>
  );
};
