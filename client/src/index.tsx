import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "180080882825-to464u7earqlme8o2muc5e0bqll8llih.apps.googleusercontent.com";

// renders React Component "Root" into the DOM element with ID "root"
ReactDOM.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>,
  document.getElementById("root")
);

// allows for live updating
module.hot.accept();
