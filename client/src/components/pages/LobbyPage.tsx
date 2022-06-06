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
  joinLobbyPageRequestBodyType,
  joinLobbyPageResponseType,
  LobbyLevel,
  LobbyRoom,
} from "../../../../shared/apiTypes";
import { RouteComponentProps } from "@reach/router";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LobbySideBar from "../modules/LobbySideBar";
import LobbyMain from "../modules/LobbyMain";
import { socket } from "../../client-socket";

type LobbyPageProps = RouteComponentProps & {
  handleLogin: (res: CredentialResponse) => void;
  handleLogout: () => void;
  userId: string;
};

const LobbyPage = (props: LobbyPageProps) => {
  const [levels, setLevels] = useState<LobbyLevel[]>([]);
  const [levelId, setLevelId] = useState<string>("");
  const [leaderboard, setLeaderboard] = useState<Leaderboard>({ topRatings: [], topScores: [] });
  const [rooms, setRooms] = useState<LobbyRoom[]>([]);
  const userId = props.userId;

  useEffect(() => {
    if (!userId) return;
    const body: joinLobbyPageRequestBodyType = {};
    post("/api/joinLobbyPage", body).then((res: joinLobbyPageResponseType) => {
      setLevels(res.levels);
      setLevelId(res.levelId);
      setLeaderboard(res.leaderboard);
      setRooms(res.rooms);
    });
  }, [userId]);

  useEffect(() => {
    const callback = (room: LobbyRoom) => {
      setRooms((rooms) => rooms.concat([room]));
    };
    socket.on("newRoom", callback);
    return () => {
      socket.off("newRoom", callback);
    };
  }, []);

  useEffect(() => {
    const callback = (roomName: string) => {
      setRooms((rooms) => rooms.filter((entry) => entry.name !== roomName));
    };
    socket.on("destroyedRoom", callback);
    return () => {
      socket.off("destroyedRoom", callback);
    };
  }, []);

  useEffect(() => {
    const callback = (room: LobbyRoom) => {
      setRooms((rooms) => rooms.filter((entry) => entry.name !== room.name).concat([room]));
    };
    socket.on("updateRoom", callback);
    return () => {
      socket.off("updateRoom", callback);
    };
  });

  return (
    <Grid container width="100%" direction="row">
      <Box width="250px">
        <LobbySideBar
          levels={levels}
          levelId={levelId}
          setLevelId={setLevelId}
          leaderboard={leaderboard}
        />
        {props.userId ? (
          "Logged In"
        ) : (
          <GoogleLogin onSuccess={props.handleLogin} onError={() => console.log("Login Failed")} />
        )}
      </Box>
      <Box width="calc(100% - 300px)">
        <LobbyMain rooms={rooms} level={levels.find((level) => level._id === levelId)} />
      </Box>
    </Grid>
  );
};

export default LobbyPage;
