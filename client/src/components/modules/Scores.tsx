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

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { ListItemText } from "@mui/material";

type ScoresProps = {
  scores?: Score[];
  users?: RoomUser[];
  userId: string;
};

const BorderLinearProgress = styled(LinearProgress)<{ special: boolean }>(({ theme, special }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: special ? "#FF32DE" : theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));
const getListItem = (isCurrentUser: boolean, name: string, score: number, max: number) => (
  <ListItem key={name}>
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Box width="150px">
        <ListItemText
          primary={name}
          primaryTypographyProps={{
            color: isCurrentUser ? "#FF32DE" : "#306AFF",
            fontWeight: isCurrentUser ? "bold" : undefined,
          }}
          secondary={score > 0 && score}
        />
      </Box>
      <Box width="calc(100% - 150px)">
        <BorderLinearProgress
          special={isCurrentUser}
          color={score === max ? "primary" : "primary"}
          variant="determinate"
          value={(100.0 * score) / Math.max(10, max)}
        />
      </Box>
    </Grid>
  </ListItem>
);
const Scores = (props: ScoresProps) => {
  const [max, setMax] = React.useState(1);
  useEffect(() => {
    if (props.scores) {
      var largest = 1;
      for (var i = 0; i < props.scores.length; i++) {
        if (props.scores[i].score > largest) {
          largest = props.scores[i].score;
        }
      }
      setMax(largest);
    }
  }, [props.scores]);
  var listItems: JSX.Element[] = [];
  if (props.scores) {
    listItems = props.scores.map((entry) =>
      getListItem(entry.userId === props.userId, entry.name, entry.score, max)
    );
  } else {
    listItems = props.users.map((entry) =>
      getListItem(entry._id === props.userId, entry.name, 0, 1)
    );
  }
  return (
    <Grid container direction="column">
      <List>{listItems}</List>
    </Grid>
  );
};

export default Scores;
