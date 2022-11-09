/* eslint-disable @next/next/no-img-element */
import {
  Avatar,
  MenuButton,
  MenuItem,
  Menu,
  MenuList,
  SkeletonCircle,
  Stack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import styled from "styled-components";
import { Box } from "@chakra-ui/react";
import { RetroToggle } from "components/Toggle/RetroToggle";
import Router from "next/router";
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
    <Header backgroundColor={bg}>
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
            <RetroToggle onToggle={toggleColorMode} colorMode={colorMode} />
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
