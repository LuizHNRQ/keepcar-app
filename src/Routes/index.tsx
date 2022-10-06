import React, { useContext } from "react";

import Auth from "./auth";
import Logged from "./logged";
import { useAuth } from "../contexts/auth";

const Routes = () => {
  const { signed } = useAuth();

  return signed ? <Logged /> : <Auth />;
};

export default Routes;
