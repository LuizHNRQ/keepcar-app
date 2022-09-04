import React, { useContext } from "react";

import Auth from "./auth";
import Logged from "./logged";
import AuthContext from "../contexts/auth";

const Routes = () => {
  const { signed } = useContext(AuthContext);

  return signed ? <Logged /> : <Auth />;
};

export default Routes;
