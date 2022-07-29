import { Box, Flex, Heading, useColorModeValue } from "@chakra-ui/react";
import { RetroMemberSelectModal } from "components/Modals/RetroMemberSelectModal";
import { RetroWorkspaceCreateModal } from "components/Modals/RetroWorkspaceCreateModal";
import { RetroBody } from "components/RetroHome";
import UserSelect from "components/UserSelect";
import { firestore } from "configs/firebase/firestore";
import { useAuthContext } from "context/Auth/AuthContext";
import { getDoc, doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Collection } from "utils/firebaseCollection";
import { Workspace } from "utils/interfaces";

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 1600px;
`;

export const RetroWorkspace = () => {
  const { member } = useAuthContext();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const workspaceBg = useColorModeValue("white", "gray.700");

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
      });
    }
  }, [member]);

  return (
    <Wrapper>
      <RetroWorkspaceCreateModal updateWorkspace={updateWorkspace} />
      {workspaces.map(({ workspaceId, workspaceTitle, userId, members }) => (
        <Box
          backgroundColor={workspaceBg}
          borderRadius="8px"
          boxShadow="0 4px 12px 0 rgb(0 0 0 / 5%)"
          key={workspaceId}
          margin="2rem"
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
      ))}
    </Wrapper>
  );
};
