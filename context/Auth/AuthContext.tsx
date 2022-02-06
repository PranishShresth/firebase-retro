import { signInWithAnonymousCredentials } from "configs/firebase/firebaseClient";
import { User, UserCredential } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

type AnonymousUser = Pick<User, "uid" | "isAnonymous" | "metadata">;

interface Auth {
  user: null | AnonymousUser;
}

const AuthContext = createContext<Auth>({ user: null });

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AnonymousUser | null>(null);
  useEffect(() => {
    signInWithAnonymousCredentials().then((authUser: UserCredential) => {
      const {
        user: { isAnonymous, metadata, uid },
      } = authUser;
      setUser({ isAnonymous, metadata, uid });
    });
  }, []);
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};
