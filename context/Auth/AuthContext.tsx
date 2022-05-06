import { signInWithAnonymousCredentials } from "configs/firebase/firebaseClient";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

type AnonymousUser = Pick<User, "uid" | "isAnonymous" | "metadata">;

interface Auth {
  updateUser: (data: User) => void;
  user: null | AnonymousUser;
}

const AuthContext = createContext<Auth>({
  updateUser: () => null,
  user: null,
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AnonymousUser | null>(null);
  // useEffect(() => {
  //   signInWithAnonymousCredentials().then((authUser: UserCredential) => {
  //     const {
  //       user: { isAnonymous, metadata, uid },
  //     } = authUser;
  //     setUser({ isAnonymous, metadata, uid });
  //   });
  // }, []);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // updateUser is for setting the user context telling it that there is a user logged in
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
    });
  }, []);

  const updateUser = (data: User) => {
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{ updateUser, user }}>
      {children}
    </AuthContext.Provider>
  );
};
