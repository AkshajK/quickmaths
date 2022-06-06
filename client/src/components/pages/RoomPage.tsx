import React, { useState, useEffect } from "react";
import { post } from "../../utilities";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

import {
  User,
  Game,
  Level,
  Message,
  Question,
  QuestionType,
  Room,
  Score,
  Leaderboard,
  joinRoomPageRequestBodyType,
  joinRoomPageResponseType,
  LobbyLevel,
  LobbyRoom,
} from "../../../../shared/apiTypes";
import { RouteComponentProps } from "@reach/router";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LobbySideBar from "../modules/LobbySideBar";
import LobbyMain from "../modules/LobbyMain";
import { socket } from "../../client-socket";

type RoomPageProps = RouteComponentProps & {
  userId: string;
};

const RoomPage = (props: RoomPageProps) => {
  const userId = props.userId;
  useEffect(() => {
    if (!userId) return;
    const body: joinRoomPageRequestBodyType = { roomName: "GET_FROM_ROUTE" };
    post("/api/joinRoomPage", body).then((res: joinRoomPageResponseType) => {});
  }, [userId]);

  return <Grid container width="100%" direction="row"></Grid>;
};

export default RoomPage;
