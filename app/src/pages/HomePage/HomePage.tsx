import React from "react";
import { withOktaAuth } from "@okta/okta-react";
import { AuthState, OktaAuth } from "@okta/okta-auth-js";

type withOktaProps = {
  oktaAuth: OktaAuth;
  authState: AuthState;
};

const HomeComponent = ({ oktaAuth, authState }: withOktaProps) => {
  const login = async () => {
    await oktaAuth.signInWithRedirect();
  };

  const logout = async () => {
    await oktaAuth.signOut();
  };

  let loginSection = null;
  if (authState?.isAuthenticated) {
    loginSection = (
      <div className="Buttons">
        <button onClick={logout}>Logout</button>
        {/* Replace me with your root component. */}
      </div>
    );
  } else {
    loginSection = (
      <div className="Buttons">
        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <>
      <h1>Admin Home page</h1>
    </>
  );
};

const HomePage = withOktaAuth(HomeComponent);

export { HomePage };
