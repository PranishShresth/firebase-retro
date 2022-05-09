import { Box, useColorModeValue } from "@chakra-ui/react";
import DualRingLoader from "components/Loader/DualRingLoader";
import { useAuthContext } from "context/Auth/AuthContext";
import SignIn from "pages/signIn";

const withAuth = (Component: any) => {
  const Auth = (props: any) => {
    const { user, isLoadingUserData } = useAuthContext();
    const bg = useColorModeValue("#F7F7F7", "gray.900");

    if (isLoadingUserData) {
      return (
        <Box backgroundColor={bg} height={"100%"} width={"100%"}>
          <DualRingLoader />
        </Box>
      );
    }
    // If user is not logged in, return login component
    if (!user) {
      return <SignIn />;
    }

    // If user is logged in, return original component
    return <Component {...props} />;
  };

  // Copy getInitial props so it will run as well
  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default withAuth;
