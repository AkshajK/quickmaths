import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound";
import Skeleton from "./pages/Skeleton";
import LobbyPage from "./pages/LobbyPage";
import "../utilities.css";

import { socket } from "../client-socket";

import { get, post } from "../utilities";

/**
 * Define the "App" component
 */
const App = () => {
  const [userId, setUserId] = useState(undefined);

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
      }
    });
  }, []);

  const handleLogin = (res) => {
    const userToken = res.credential;
    post("/api/login", { token: userToken }).then((user) => {
      window.location.reload();
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    post("/api/logout");
  };
  return (
    <>
      <Router>
        <LobbyPage path="/" handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
        <Skeleton
          path="/login"
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          userId={userId}
        />
        <NotFound default />
      </Router>
    </>
  );
};

export default App;
