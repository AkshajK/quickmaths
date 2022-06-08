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
import Chat from "./Chat";

type RoomSideBarProps = { levelName: string; roomId: string; messages: Message[] };

const RoomSideBar = (props: RoomSideBarProps) => {
  return (
    <Grid container direction="column">
      <Typography
        variant="h4"
        align="center"
        color="#306AFF"
        sx={{ fontWeight: "bold", marginRight: "6px" }}
      >
        QuickMaths
      </Typography>
      <Typography
        variant="h5"
        align="center"
        color="#306AFF"
        sx={{ fontWeight: "bold", marginRight: "6px" }}
      >
        {props.levelName}
      </Typography>
      <Chat roomId={props.roomId} messages={props.messages} />
    </Grid>
  );
};

export default RoomSideBar;
