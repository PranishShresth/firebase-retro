import { Box, Flex, Heading, useColorModeValue } from "@chakra-ui/react";
import { RetroMemberSelectModal } from "components/Modals/RetroMemberSelectModal";
import { RetroWorkspaceCreateModal } from "components/Modals/RetroWorkspaceCreateModal";
import NoWorkspaces from "components/NoWorkspaces/NoWorkspaces";
import { RetroBody } from "components/RetroHome";
import { firestore } from "configs/firebase/firestore";
import { useAuthContext } from "context/Auth/AuthContext";
import { getDoc, doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Collection } from "utils/firebaseCollection";
import { Workspace } from "utils/interfaces";

const StyledFlex = styled(Flex)`
  left: 50%;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -65%);
  width: 700px;
`;

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 1600px;
  padding: 1rem;
`;

export const RetroWorkspace = () => {
  const { member } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const workspaceBg = useColorModeValue("white", "gray.700");
  const noWorkspaces = workspaces.length === 0;

  const updateWorkspace = (workspace: Workspace) => {
    setWorkspaces((prev) => [...prev, workspace]);
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
    return <div>Loading....</div>;
  }

  return (
    <Wrapper>
      {noWorkspaces ? (
        <StyledFlex flexDirection="column" alignItems="center">
          <NoWorkspaces />
          <RetroWorkspaceCreateModal updateWorkspace={updateWorkspace} />
        </StyledFlex>
      ) : (
        <>
          <RetroWorkspaceCreateModal updateWorkspace={updateWorkspace} />
          {workspaces.map(
            ({ workspaceId, workspaceTitle, userId, members }) => (
              <Box
                backgroundColor={workspaceBg}
                borderRadius="8px"
                boxShadow="0 4px 12px 0 rgb(0 0 0 / 5%)"
                key={workspaceId}
                margin="1.5rem"
                padding="1rem"
              >
                <Flex alignItems="center" justifyContent="space-between">
                  <Heading as="h4" size="md">
                    {workspaceTitle}
                  </Heading>
                  <RetroMemberSelectModal
                    workspaceId={workspaceId}
                    userId={userId}
                    members={members}
                  />
                </Flex>
                <RetroBody workspaceId={workspaceId} />
              </Box>
            )
          )}
        </>
      )}
    </Wrapper>
  );
};
