import { withOktaAuth } from "@okta/okta-react";
import { useOktaAuth } from "@okta/okta-react";
import useCheckPermissions from "./../../hooks/useCheckPermissions";

const allowedTo = ["custom-fee:read"];

const SystemFeesPageComponent = ({}) => {
  const { authState, oktaAuth } = useOktaAuth();
  const hasPermission = useCheckPermissions(allowedTo);

  if (!hasPermission) {
    return <p>Sorry, you do not have sufficient permissions.</p>;
  }

  return <p>Welcome, you have sufficient permissions to access System Fees!</p>;
};

const SystemFeesPage = withOktaAuth(SystemFeesPageComponent);

export { SystemFeesPage };
