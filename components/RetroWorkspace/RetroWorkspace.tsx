import { firestore } from "configs/firebase/firestore";
import { useAuthContext } from "context/Auth/AuthContext";
import { getDoc, doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";

import { Collection } from "utils/firebaseCollection";
import { Workspace } from "utils/interfaces";

export const RetroWorkspace = () => {
  const { userDetails } = useAuthContext();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  useEffect(() => {
    if (userDetails) {
      const workspaces = userDetails.workspaces;
      const promises = workspaces.map((id) =>
        getDoc(doc(firestore, Collection.Workspaces, id))
      );
      Promise.all(promises).then((workspace) => {
        setWorkspaces(workspace.map((_) => _.data() as Workspace));
      });
    }
  }, [userDetails]);

  return <div>{workspaces.map((x) => x.workspaceTitle)}</div>;
};
