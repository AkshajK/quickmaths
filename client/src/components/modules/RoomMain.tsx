import React, { useState, useEffect } from "react";
import { post } from "../../utilities";
import {
  User,
  Game,
  Level,
  Message,
  Question,
  QuestionType,
  Room,
  RoomUser,
  Score,
  Leaderboard,
  LobbyLevel,
  startGameRequestBodyType,
} from "../../../../shared/apiTypes";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Timer from "./Timer";
import QuestionBox from "./QuestionBox";
import Scores from "./Scores";

type RoomMainProps = {
  status: "waiting" | "aboutToStart" | "inProgress" | "complete";
  scores: Score[];
  users: RoomUser[];
  startTime: Date;
  question?: Question;
  roomId: string;
  guess: (guess: string) => void;
  userId: string;
};

const RoomMain = (props: RoomMainProps) => {
  const startGame = () => {
    const body: startGameRequestBodyType = { roomId: props.roomId };
    post("/api/startGame", body);
  };
  switch (props.status) {
    case "waiting":
      return (
        <Grid container direction="column">
          <Scores users={props.users} userId={props.userId} />
          <Button fullWidth onClick={startGame}>
            Start Game
          </Button>
        </Grid>
      );
    case "aboutToStart":
      return (
        <Grid container direction="column">
          <Timer backwards endTime={props.startTime} totalSeconds={3} />
          <Scores scores={props.scores} userId={props.userId} />
          <Button disabled fullWidth>
            Start Game
          </Button>
        </Grid>
      );
    case "inProgress":
      return (
        <Grid container direction="column">
          <Timer endTime={props.startTime} totalSeconds={30} />
          <QuestionBox question={props.question} guess={props.guess} />
          <Scores scores={props.scores} userId={props.userId} />
        </Grid>
      );
    case "complete":
      return (
        <Grid container direction="column">
          <Scores scores={props.scores} userId={props.userId} users={props.users} />
          <Button fullWidth onClick={startGame}>
            Rematch
          </Button>
        </Grid>
      );
  }
};

export default RoomMain;
