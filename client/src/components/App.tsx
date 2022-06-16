import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound";
import Skeleton from "./pages/Skeleton";
import LobbyPage from "./pages/LobbyPage";
import RoomPage from "./pages/RoomPage";
import "../utilities.css";
import "antd/dist/antd.css";
import { socket } from "../client-socket";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { get, post } from "../utilities";

/**
 * Define the "App" component
 */
const App = () => {
  const [userId, setUserId] = useState(undefined);
  const [loggedInGoogle, setLoggedInGoogle] = useState<boolean>(false);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  useEffect(() => {
    let token = cookies.get("cookieToken");
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
        setLoggedInGoogle(user.googleid ? true : false);
      } else {
        post("/api/login", { cookieToken: token || "no token" }).then((user) => {
          post("/api/initsocket", { socketid: socket.id }).then(() => {
            setUserId(user._id);
            setLoggedInGoogle(user.googleid ? true : false);
            if (!token)
              cookies.set("cookieToken", user.cookieToken, {
                expires: new Date("December 17, 2030 03:24:00"),
              });
          });
        });
      }
    });
  }, []);

  useEffect(() => {
    if (!userId) return;
    socket.on("disconnect", () => {
      setSocketConnected(false);
      setTimeout(() => {
        if (!socketConnected) {
          window.location.reload();
        }
      }, 2000);
    });
  }, [userId]);
  useEffect(() => {
    if (!userId) return;
    socket.on("connect", () => {
      setSocketConnected(true);
    });
  }, [userId]);

  const handleLogin = (res) => {
    const userToken = res.credential;
    let token = cookies.get("cookieToken");
    post("/api/googleLogin", { token: userToken, cookieToken: token || "no token" }).then(
      (user) => {
        post("/api/initsocket", { socketid: socket.id }).then(() => {
          setUserId(user._id);
          setLoggedInGoogle(user.googleid ? true : false);
          if (!token)
            cookies.set("cookieToken", user.cookieToken, {
              expires: new Date("December 17, 2030 03:24:00"),
            });
        });
      }
    );
  };

  const handleLogout = () => {
    setUserId(undefined);
    post("/api/logout");
  };
  return (
    <>
      <Router>
        <LobbyPage
          path="/"
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          loggedInGoogle={loggedInGoogle}
          userId={userId}
        />
        <RoomPage
          path="/:roomName"
          userId={userId}
          loggedInGoogle={loggedInGoogle}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
        />
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
