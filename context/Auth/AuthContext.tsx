import { auth } from "configs/firebase/firebaseClient";
import { onAuthStateChanged, User } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AnonymousUser, Auth, Member } from "utils/interfaces";
import { firestore } from "configs/firebase/firestore";

const AuthContext = createContext<Auth>({
  isLoadingUserData: true,
  member: null,
  updateUser: () => null,
  updateMember: () => null,
  user: null,
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AnonymousUser | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        const member = await getDoc(doc(firestore, "users", uid));
        if (member.exists()) {
          setMember(member.data() as Member);
          setUser(user);
        } else {
          setUser(null);
          setMember(null);
        }
        setIsLoadingUserData(false);
      }
    });
  }, []);

  const updateUser = (data: User) => {
    setUser(data);
  };

  const updateMember = (data: Member) => {
    setMember(data);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoadingUserData,
        member,
        updateUser,
        updateMember,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
