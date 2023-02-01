// import React from 'react';
// import './App.css';
import Cookies from "js-cookie";
import {
  Route,
  withRouter,
  BrowserRouter as Router,
  useHistory,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { Security, SecureRoute } from "@okta/okta-react";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { SystemFeesPage } from "./pages/SystemFeesPage/SystemFeesPage";
import { DashboardPage } from "./pages/DashboardPage/DashboardPage";

import CustomLoginCallback from "./components/LoginCallback/LoginCallback";
import Header from "./components/Header";
import { EventsPage } from "./pages/EventsPage/EventsPage";
import { ReportsPage } from "./pages/ReportsPage/ReportsPage";

const oktaAuth = new OktaAuth({
  issuer: process.env.REACT_APP_OKTA_DOMAIN + "/oauth2/aus85ugz1xYPXYka95d7",
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  redirectUri: window.location.origin + "/login/callback",
  scopes: ["openid", "email", "profile", "offline_access", "permissions"],
  // tokenManager: {
  //   storage: oktaCustomStorageProvider,
  // },
  devMode: process.env.REACT_APP_OKTA_DEV_MODE === "true",
  responseMode: "query",
});

const App = () => {
  const [corsErrorModalOpen, setCorsErrorModalOpen] = useState(false);
  const [authRequiredModalOpen, setAuthRequiredModalOpen] = useState(false);

  const history = useHistory(); // example from react-router

  const triggerLogin = async () => {
    await oktaAuth.signInWithRedirect();
  };

  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri || "/", window.location.origin));
  };

  const customAuthHandler = async () => {
    const previousAuthState = oktaAuth.authStateManager.getPreviousAuthState();
    if (!previousAuthState || !previousAuthState.isAuthenticated) {
      // App initialization stage
      await triggerLogin();
    } else {
      // Ask the user to trigger the login process during token autoRenew process
      setAuthRequiredModalOpen(true);
    }
  };

  return (
    <Security
      oktaAuth={oktaAuth}
      onAuthRequired={customAuthHandler}
      restoreOriginalUri={restoreOriginalUri}
    >
      <Header />
      <SecureRoute path="/" exact={true} component={DashboardPage} />
      <SecureRoute path="/dashboard" exact={true} component={DashboardPage} />
      <SecureRoute
        path="/system-fees"
        exact={true}
        component={SystemFeesPage}
      />
      <SecureRoute path="/events" exact={true} component={EventsPage} />
      <SecureRoute path="/reports" exact={true} component={ReportsPage} />

      <Route path="/login/callback" component={CustomLoginCallback} />
    </Security>
  );
};

const AppWithRouterAccess = withRouter(App);

const RouterApp = () => {
  return (
    <Router>
      <AppWithRouterAccess />
    </Router>
  );
};

export default RouterApp;
