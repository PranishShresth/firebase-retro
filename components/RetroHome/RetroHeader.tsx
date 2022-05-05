import { Button, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { getAuth } from "firebase/auth";
import Link from "next/link";
import styled from "styled-components";
import { Box } from "@chakra-ui/react";
import { firestore } from "configs/firebase/firestore";
import { DarkModeToggle } from "components/Toggle/Toggle";
import Router from "next/router";
import { query, collection, where, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { usersRef } from "utils/firebaseCollection";

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
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("white", "gray.600");

  const auth = getAuth();

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
    (async () => {
      const auth = getAuth();

      console.log("Auth", auth);

      console.log("currentUser uid", auth.currentUser?.uid);
      if (auth.currentUser && auth.currentUser.uid) {
        const userQuery = query(
          usersRef,
          where("user_id", "==", auth.currentUser.uid)
        );
        const userSnapshot = await getDocs(userQuery);

        const users = userSnapshot.docs.map((user) => {
          return { ...user.data() };
        });

        console.log("users", users);
      }
    })();
  }, []);

  return (
    <Header backgroundColor={bg}>
      <Container>
        <HeaderBanner>
          <Link href="/">Retro Board</Link>
          <Button onClick={signOut}>Sign Out</Button>
          <DarkModeToggle onToggle={toggleColorMode} colorMode={colorMode} />
        </HeaderBanner>
      </Container>
    </Header>
  );
};
