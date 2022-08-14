import React from "react";
import { Provider } from "react-redux";

import Routes from "./Routes";
import { store } from "./store";

export default function App() {
  const isLoggedIn = false;

  return (
    // <Provider store={store}>
    <Routes isAuthenticated={isLoggedIn} />
    // </Provider>
  );
}
