/* eslint-disable @next/next/no-img-element */
import {
  Avatar,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SkeletonCircle,
  Stack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { DarkModeToggle } from "components/Toggle/Toggle";
import { auth } from "configs/firebase/firebaseClient";
import { useAuthContext } from "context/Auth/AuthContext";
import Link from "next/link";
import Router from "next/router";
import styled from "styled-components";

export const RetroHeader = () => {
  const { member } = useAuthContext();
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("white", "#1C2A3A");
  const isDarkMode = colorMode === "dark";

  const goToProfile = () => Router.push("/profile");

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

  return (
    <Header backgroundColor={bg} padding={{ base: 4 }}>
      <Container>
        <HeaderBanner>
          <Link href="/" passHref>
            <img
              alt="Shiny Retro Logo"
              src={isDarkMode ? "/logo-dark.svg" : "/logo-light.svg"}
              width={"120px"}
            />
          </Link>

          <Stack direction={"row"}>
            <DarkModeToggle onToggle={toggleColorMode} colorMode={colorMode} />
            {member ? (
              <Menu>
                <MenuButton>
                  <Avatar
                    name={`${member?.firstName} ${member?.lastName}`}
                    size={"sm"}
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={goToProfile}>Profile</MenuItem>
                  <MenuItem onClick={signOut}>Sign Out</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <SkeletonCircle size="8" />
            )}
          </Stack>
        </HeaderBanner>
      </Container>
    </Header>
  );
};
const Header = styled(Box).attrs({ className: "header-bar" })`
  color: #2bc0c1;
  box-shadow: 0 4px 12px 0 rgb(0 0 0 / 5%);
  font-weight: 800;
`;
const HeaderBanner = styled.div`
  font-size: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Container = styled.div`
  max-width: 1536px;
  margin: 0 auto;
`;
