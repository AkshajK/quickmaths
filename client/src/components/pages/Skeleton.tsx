import React from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import "./Skeleton.css";
import { RouteComponentProps } from "@reach/router";
//TODO(weblab student): REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "180080882825-to464u7earqlme8o2muc5e0bqll8llih.apps.googleusercontent.com";
type Props = RouteComponentProps & {
  userId: String;
  handleLogin: (res: CredentialResponse) => void;
  handleLogout: () => void;
};
const Skeleton = (props: Props) => {
  return (
    <>
      {props.userId ? (
        "Logged In"
      ) : (
        <GoogleLogin onSuccess={props.handleLogin} onError={() => console.log("Login Failed")} />
      )}
      <h1>Good luck on your project :)</h1>
      <h2> What you need to change in this skeleton</h2>
      <ul>
        <li>
          Change the Frontend CLIENT_ID (Skeleton.js) to your team's CLIENT_ID (obtain this at
          http://weblab.to/clientid)
        </li>
        <li>Change the Server CLIENT_ID to the same CLIENT_ID (auth.js)</li>
        <li>
          Change the Database SRV (mongoConnectionURL) for Atlas (server.js). You got this in the
          MongoDB setup.
        </li>
        <li>Change the Database Name for MongoDB to whatever you put in the SRV (server.js)</li>
      </ul>
      <h2>How to go from this skeleton to our actual app</h2>
      <a href="https://docs.google.com/document/d/110JdHAn3Wnp3_AyQLkqH2W8h5oby7OVsYIeHYSiUzRs/edit?usp=sharing">
        Check out this getting started guide
      </a>
    </>
  );
};

export default Skeleton;
