import React, { useContext } from "react";

import Auth from "./auth";
import Logged from "./logged";
import { useAuth } from "../contexts/auth";

const Routes = () => {
  const { signed } = useAuth();

  console.log("route");

  return signed ? <Logged /> : <Auth />;
};

export default Routes;
