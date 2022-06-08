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

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { ListItemText } from "@mui/material";

type ScoresProps = {
  scores: Score[];
};

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));

const Scores = (props: ScoresProps) => {
  const [max, setMax] = React.useState(1);
  useEffect(() => {
    var largest = 1;
    for (var i = 0; i < props.scores.length; i++) {
      if (props.scores[i].score > largest) {
        largest = props.scores[i].score;
      }
    }
    setMax(largest);
  }, [props.scores]);
  return (
    <Grid container direction="column">
      <List>
        {props.scores.map((entry) => (
          <ListItem>
            <ListItemText primary={entry.name} secondary={entry.score} />
            <BorderLinearProgress
              color={entry.score === max ? "secondary" : "primary"}
              variant="determinate"
              value={(100.0 * entry.score) / max}
            />
          </ListItem>
        ))}
      </List>
    </Grid>
  );
};

export default Scores;
