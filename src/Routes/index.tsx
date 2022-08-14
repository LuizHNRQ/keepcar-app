import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import Auth from "./auth";
import Logged from "./logged";

type Routes = {
  isAuthenticated: boolean;
};

const Routes = ({ isAuthenticated }: Routes) => {
  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Logged />
      ) : (
        // Auth screens
        <Auth />
      )}
      {/* Common modal screens */}
    </NavigationContainer>
  );
};

export default Routes;
