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
  Score,
  Leaderboard,
  LobbyLevel,
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
  startTime: Date;
  question?: Question;
};

const RoomMain = (props: RoomMainProps) => {
  switch (props.status) {
    case "waiting":
      return (
        <Grid container direction="column">
          <Scores scores={props.scores} />
          <Button fullWidth>Start Game</Button>
        </Grid>
      );
    case "aboutToStart":
      return (
        <Grid container direction="column">
          <Timer backwards endTime={props.startTime} totalSeconds={3} />
          <Scores scores={props.scores} />
          <Button disabled fullWidth>
            Start Game
          </Button>
        </Grid>
      );
    case "inProgress":
      return (
        <Grid container direction="column">
          <Timer endTime={props.startTime} totalSeconds={30} />
          <QuestionBox question={props.question as Question} />
          <Scores scores={props.scores} />
        </Grid>
      );
    case "complete":
      return (
        <Grid container direction="column">
          <Scores scores={props.scores} />
          <Button fullWidth>Rematch</Button>
        </Grid>
      );
  }
};

export default RoomMain;
