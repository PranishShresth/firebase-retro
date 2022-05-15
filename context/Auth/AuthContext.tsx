import {
  auth,
  signInWithAnonymousCredentials,
} from "configs/firebase/firebaseClient";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { query, collection, where, getDocs } from "firebase/firestore";
import { usersRef } from "utils/firebaseCollection";
import React, { createContext, useContext, useEffect, useState } from "react";

type AnonymousUser = Pick<User, "uid" | "isAnonymous" | "metadata">;

interface UserDetails {
  created_at: { seconds: number; nanoseconds: number };
  email: string;
  first_name: string;
  surname: string;
  user_id: string;
}

interface Auth {
  isLoadingUserData: boolean;
  updateUser: (data: User) => void;
  updateUserDetails: (data: UserDetails) => void;
  user: null | AnonymousUser;
  userDetails: null | UserDetails;
}

const AuthContext = createContext<Auth>({
  isLoadingUserData: true,
  updateUser: () => null,
  updateUserDetails: () => null,
  user: null,
  userDetails: null,
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AnonymousUser | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  // useEffect(() => {
  //   signInWithAnonymousCredentials().then((authUser: UserCredential) => {
  //     const {
  //       user: { isAnonymous, metadata, uid },
  //     } = authUser;
  //     setUser({ isAnonymous, metadata, uid });
  //   });
  // }, []);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        const userQuery = query(usersRef, where("user_id", "==", uid));
        const userSnapshot = await getDocs(userQuery);
        const users = userSnapshot.docs.map((user) => {
          return { ...user.data() };
        });

        // setUser is for setting the user context telling it that there is a user logged in
        setUser(user);
        // setUserDetails is for getting the current logged in user's firstName, surname, etc from the "users" table in firestore
        setUserDetails(users[0]);
        setIsLoadingUserData(false);
      } else {
        // User is signed out
        setUser(null);
        setUserDetails(null);
        setIsLoadingUserData(false);
      }
    });
  }, []);

  const updateUser = (data: User) => {
    setUser(data);
  };

  const updateUserDetails = (data: UserDetails) => {
    setUserDetails(data);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoadingUserData,
        updateUser,
        updateUserDetails,
        user,
        userDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
