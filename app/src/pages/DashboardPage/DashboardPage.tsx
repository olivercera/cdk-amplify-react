import { withOktaAuth } from "@okta/okta-react";
import { useOktaAuth } from "@okta/okta-react";

const DashboardPageComponent = ({}) => {
  const { authState, oktaAuth } = useOktaAuth();

  return <> This is the dasboard</>;
};

const DashboardPage = withOktaAuth(DashboardPageComponent);

export { DashboardPage };
