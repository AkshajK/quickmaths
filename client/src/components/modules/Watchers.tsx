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
  RoomUser,
  Leaderboard,
  LobbyLevel,
} from "../../../../shared/apiTypes";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { ListItemText } from "@mui/material";

type WatchersProps = {
  watchers: RoomUser[];
};

const Watchers = (props: WatchersProps) => {
  const watcherElements = props.watchers.map((watcher) => {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <DirectionsBikeIcon fontSize="large" />
        <Typography variant="h6" align="center" sx={{ fontWeight: "bold" }}>
          {watcher.name}
        </Typography>
      </Box>
    );
  });
  return (
    <Grid container direction="row">
      {watcherElements}
    </Grid>
  );
};

export default Watchers;
