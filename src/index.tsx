import React from "react";
import { Provider } from "react-redux";
import store from "./reduxStore";

import Routes from "./Routes";

export default function App() {
  const isLoggedIn = false;

  return (
    <Provider store={store}>
      <Routes isAuthenticated={isLoggedIn} />
    </Provider>
  );
}
