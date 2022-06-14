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
  RoomUser,
  messageSocketEmitType,
  guessSocketEmitType,
  guessRequestBodyType,
  guessResponseType,
  startGameSocketEmitType,
  joinRoomPageSocketEmitType,
  leaveRoomPageSocketEmitType,
} from "../../../../shared/apiTypes";
import { RouteComponentProps } from "@reach/router";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LobbySideBar from "../modules/LobbySideBar";
import LobbyMain from "../modules/LobbyMain";
import { socket } from "../../client-socket";

import RoomSideBar from "../modules/roomSideBar";
import RoomMain from "../modules/RoomMain";

type RoomPageProps = RouteComponentProps & {
  userId: string;
  roomName?: string;
  loggedInGoogle: boolean;
  handleLogin: (res: CredentialResponse) => void;
  handleLogout: () => void;
};

const RoomPage = (props: RoomPageProps) => {
  const userId = props.userId;
  const [status, setStatus] = useState<"waiting" | "aboutToStart" | "inProgress" | "complete">(
    "waiting"
  );
  const [roomId, setRoomId] = useState<string>("");
  const [levelName, setLevelName] = useState<string>("");
  const [users, setUsers] = useState<RoomUser[]>([]);
  const [spectatingUsers, setSpectatingUsers] = useState<RoomUser[]>([]);
  const [spectating, setSpectating] = useState<boolean>(false);
  const [question, setQuestion] = useState<Question | undefined>(undefined);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [scores, setScores] = useState<Score[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!userId) return;
    const body: joinRoomPageRequestBodyType = { roomName: props.roomName as string };
    post("/api/joinRoomPage", body).then((res: joinRoomPageResponseType) => {
      setStatus(res.status);
      setRoomId(res.roomId);
      setLevelName(res.levelName);
      setUsers(res.users);
      setSpectatingUsers(res.spectatingUsers);
      setSpectating(res.spectating);
      if (res.question) setQuestion(res.question);
      if (res.startTime) setStartTime(res.startTime);
      if (res.scores) setScores(res.scores);
    });
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const callback = (data: startGameSocketEmitType) => {
      setStatus("aboutToStart");
      setStartTime(data.startTime);
      setScores(data.scores);
    };
    socket.on("aboutToStart", callback);
    return () => {
      socket.off("aboutToStart", callback);
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const callback = (data: { question: Question; endTime: Date }) => {
      setQuestion(data.question);
      setStartTime(data.endTime);
      setStatus("inProgress");
    };
    socket.on("inProgress", callback);
    return () => {
      socket.off("inProgress", callback);
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const callback = (data: joinRoomPageSocketEmitType) => {
      if (data.spectating) {
        setSpectatingUsers((users) => users.concat([data.user]));
      } else {
        setUsers((users) => users.concat([data.user]));
      }
    };
    socket.on("joinRoomPage", callback);
    return () => {
      socket.off("joinRoomPage", callback);
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const callback = (data: leaveRoomPageSocketEmitType) => {
      setSpectatingUsers((users) => users.filter((user) => user._id !== data.userId));
      setUsers((users) => users.filter((user) => user._id !== data.userId));
    };
    socket.on("leaveRoomPage", callback);
    return () => {
      socket.off("leaveRoomPage", callback);
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const callback = (data: { scores: Score[] }) => {
      setStatus("complete");
      setScores(data.scores);
    };
    socket.on("complete", callback);
    return () => {
      socket.off("complete", callback);
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const callback = (data: guessSocketEmitType) => {
      setScores(data.scores);
    };
    socket.on("guess", callback);
    return () => {
      socket.off("guess", callback);
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const callback = (data: messageSocketEmitType) => {
      console.log("GOT SOCKET");
      setMessages((messages) => messages.concat(data.message));
    };
    socket.on("message", callback);
    return () => {
      socket.off("message", callback);
    };
  }, [userId]);

  const guess = (userGuess: string) => {
    const body: guessRequestBodyType = { roomId, answer: userGuess };
    post("/api/guess", body).then((res: guessResponseType) => {
      if (res.correct) {
        setQuestion(res.question);
      }
    });
  };

  return (
    <Grid container width="100%" direction="row">
      <Box width="calc(100% - 320px)" padding="20px" paddingRight="5px">
        <RoomMain
          roomId={roomId}
          status={status}
          scores={scores}
          users={users}
          startTime={startTime}
          question={question}
          guess={guess}
          userId={userId}
        />
      </Box>
      <Box width="250px" padding="20px">
        <RoomSideBar levelName={levelName} roomId={roomId} messages={messages} />
        {props.loggedInGoogle ? (
          ""
        ) : (
          <GoogleLogin onSuccess={props.handleLogin} onError={() => console.log("Login Failed")} />
        )}
      </Box>
    </Grid>
  );
};

export default RoomPage;
