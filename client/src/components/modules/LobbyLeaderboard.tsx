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
} from "../../../../shared/apiTypes";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";

type LobbyLeaderboardProps = {
  leaderboard: Leaderboard;
};

const LobbyLeaderboard = (props: LobbyLeaderboardProps) => {
  return (
    <List
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Top Ratings
        </ListSubheader>
      }
    >
      {props.leaderboard.topRatings.map((entry) => (
        <ListItem>
          <ListItemText primary={entry.userName} secondary={entry.rating} />
        </ListItem>
      ))}
    </List>
  );
};

export default LobbyLeaderboard;
