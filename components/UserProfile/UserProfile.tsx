import { Avatar, Box, Text } from "@chakra-ui/react";
import { useAuthContext } from "context/Auth/AuthContext";
import styled from "styled-components";

const EditInfoWrapper = styled.div`
  flex: 2;
  height: 100%;
`;

const ProfileWrapper = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  margin: 0 auto;
  max-width: 900px;
  width: 100%;
`;

const UserInfoWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  justify-content: center;
`;

const UserProfile = () => {
  const { userDetails } = useAuthContext();

  return (
    <ProfileWrapper>
      <UserInfoWrapper>
        <Avatar
          name={`${userDetails?.first_name} ${userDetails?.surname}`}
          size={"2xl"}
        />
        <Text fontSize="4xl" marginTop="1rem">
          {userDetails?.first_name} {userDetails?.surname}
        </Text>
      </UserInfoWrapper>
      <EditInfoWrapper>
        <Box
          backgroundColor={"white"}
          borderRadius={"lg"}
          boxShadow={"0 4px 12px 0 rgb(0 0 0 / 5%)"}
          marginTop={"2rem"}
          p="6"
        >
          <Text fontSize="xl" fontWeight={"bold"}>
            When is your birthday?
          </Text>
        </Box>
      </EditInfoWrapper>
    </ProfileWrapper>
  );
};

export default UserProfile;
