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

type ChatProps = {};

const Chat = (props: ChatProps) => {
  return <Grid container direction="column"></Grid>;
};

export default Chat;
