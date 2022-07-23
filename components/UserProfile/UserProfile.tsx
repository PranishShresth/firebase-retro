import { Avatar, Text } from "@chakra-ui/react";
import { useAuthContext } from "context/Auth/AuthContext";
import styled from "styled-components";
import BirthDate from "./BirthDate";

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
  const { member } = useAuthContext();

  return (
    <ProfileWrapper>
      <UserInfoWrapper>
        <Avatar
          name={`${member?.firstName} ${member?.lastName}`}
          size={"2xl"}
        />
        <Text fontSize="4xl" marginTop="1rem">
          {member?.firstName} {member?.lastName}
        </Text>
      </UserInfoWrapper>
      <EditInfoWrapper>
        <BirthDate member={member} />
      </EditInfoWrapper>
    </ProfileWrapper>
  );
};

export default UserProfile;
