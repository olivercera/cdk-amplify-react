import { useEffect, useState } from "react";
import { useOktaAuth } from "@okta/okta-react";
import * as jose from "jose";

function useCheckPermissions(neededPermission) {
  const [hasPermission, setHasPermission] = useState(false);
  const { authState, oktaAuth } = useOktaAuth();

  useEffect(() => {
    if (!authState || !authState.isAuthenticated) {
    } else {
      const payload = jose.decodeJwt(oktaAuth.getAccessToken());
      let permissions = [];
      if (payload) {
        permissions = (payload.permissions as Array<any>) || [];
      }

      if (permissions.includes(neededPermission)) {
        setHasPermission(true);
      } else {
        setHasPermission(false);
      }
    }
  }, [neededPermission]);

  return hasPermission;
}

export default useCheckPermissions;
