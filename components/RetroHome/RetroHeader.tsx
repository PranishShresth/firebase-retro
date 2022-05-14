import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  SkeletonCircle,
  Stack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import styled from "styled-components";
import { Box } from "@chakra-ui/react";
import { firestore } from "configs/firebase/firestore";
import { DarkModeToggle } from "components/Toggle/Toggle";
import Router from "next/router";
import { query, collection, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { usersRef } from "utils/firebaseCollection";
import { useAuthContext } from "context/Auth/AuthContext";
import { auth } from "configs/firebase/firebaseClient";

const Header = styled(Box).attrs({ className: "header-bar" })`
  color: #2bc0c1;
  box-shadow: 0 4px 12px 0 rgb(0 0 0 / 5%);
  font-weight: 800;
  padding: 10px 0;
`;
const HeaderBanner = styled.div`
  font-size: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Container = styled.div`
  width: 95%;
  margin: 0 auto;
  max-width: 1600px;
`;

export const RetroHeader = () => {
  const { updateUser } = useAuthContext();
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("white", "gray.600");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>();

  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        Router.push("/signIn");
        console.log("Signed Out");
      })
      .catch((e) => {
        console.error("Sign Out Error", e);
      });
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // console.log("user", user);

        const userQuery = query(usersRef, where("user_id", "==", uid));
        const userSnapshot = await getDocs(userQuery);

        const users = userSnapshot.docs.map((user) => {
          return { ...user.data() };
        });

        // updateUser is for setting the user context telling it that there is a user logged in
        updateUser(user);
        // setUser is local state to get the current logged in user's firstName, surname, etc from the "users" table in firestore
        setUser(users[0]);
        console.log("users", users);
        setIsLoading(false);
      } else {
        // User is signed out
        setUser(null);
        setIsLoading(false);
      }
    });
  }, [updateUser]);

  return (
    <Header backgroundColor={bg}>
      <Container>
        <HeaderBanner>
          <Link href="/">Retro Board</Link>
          <Stack direction={"row"}>
            <DarkModeToggle onToggle={toggleColorMode} colorMode={colorMode} />
            {isLoading ? (
              <SkeletonCircle size="8" />
            ) : (
              <Menu>
                <MenuButton>
                  <Avatar
                    name={`${user.first_name} ${user.surname}`}
                    size={"sm"}
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem>Profile</MenuItem>
                  <MenuItem onClick={signOut}>Sign Out</MenuItem>
                </MenuList>
              </Menu>
            )}
          </Stack>
        </HeaderBanner>
      </Container>
    </Header>
  );
};
