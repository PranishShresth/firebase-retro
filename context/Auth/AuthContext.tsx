import { signInWithAnonymousCredentials } from "configs/firebase/firebaseAuth";
import { UserCredential } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

interface Auth {
  user: null | UserCredential;
}
const AuthContext = createContext<Auth>({ user: null });

export const AuthProvider = () => {
  const [user, setUser] = useState<UserCredential | null>(null);
  useEffect(() => {
    signInWithAnonymousCredentials().then((authUser: UserCredential) => {
      setUser(authUser);
    });
  }, []);
  return <AuthContext.Provider value={{ user }}></AuthContext.Provider>;
};
