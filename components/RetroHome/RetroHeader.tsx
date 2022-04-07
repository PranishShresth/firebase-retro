import styled from "styled-components";

const Header = styled.nav.attrs({ className: "header-bar" })`
  background-color: #ffffff;
  color: #4687fd;
  box-shadow: 0 4px 12px 0 rgb(0 0 0 / 5%);
  font-weight: 800;
  padding: 10px 0;
`;
const HeaderBanner = styled.div`
  font-size: 18px;
`;

const Container = styled.div`
  width: 95%;
  margin: 0 auto;
  max-width: 1600px;
`;

export const RetroHeader = () => {
  return (
    <Header>
      <Container>
        <HeaderBanner>Retro Board</HeaderBanner>
      </Container>
    </Header>
  );
};
