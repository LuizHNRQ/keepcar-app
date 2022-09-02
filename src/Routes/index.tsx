import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";

import Auth from "./auth";
import Logged from "./logged";
import AuthContext, { AuthProvider } from "../contexts/auth";

const Routes = () => {
  const { signed } = useContext(AuthContext);

  return signed ? <Logged /> : <Auth />;
};

export default Routes;
