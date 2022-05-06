import { useAuthContext } from "context/Auth/AuthContext";
import SignIn from "pages/signIn";

const withAuth = (Component: any) => {
  const Auth = (props: any) => {
    const { user } = useAuthContext();

    // If user is not logged in, return login component
    if (!user) {
      return <SignIn />;
    }

    console.log(user);

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
