import { Button, useColorMode, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import styled from "styled-components";
import { Box } from "@chakra-ui/react";

import { DarkModeToggle } from "components/Toggle/Toggle"

const Header = styled(Box).attrs({ className: "header-bar" })`
  color: #4687fd;
  box-shadow: 0 4px 12px 0 rgb(0 0 0 / 5%);
  font-weight: 800;
  padding: 10px 0;
`;
const HeaderBanner = styled.div`
  font-size: 18px;
  display:flex;
  justify-content: space-between;
  align-items: center;
`;

const Container = styled.div`
  width: 95%;
  margin: 0 auto;
  max-width: 1600px;
`;

export const RetroHeader = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const bg = useColorModeValue('white', 'gray.600')
  return (
    <Header backgroundColor={bg}>
      <Container>
        <HeaderBanner>
          <Link href="/">Retro Board</Link>

          <DarkModeToggle onToggle={toggleColorMode} colorMode={colorMode} />
          {/* <DarkModeToggle
            onChange={toggleColorMode}
            isDarkMode={colorMode === "light" ? false : true}
            size={40}
          /> */}
        </HeaderBanner>
      </Container>
    </Header>
  );
};
