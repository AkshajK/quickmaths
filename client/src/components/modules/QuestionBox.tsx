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

type QuestionBoxProps = {
  question: Question;
};

const QuestionBox = (props: QuestionBoxProps) => {
  return (
    <Grid container direction="column" justifyContent="center">
      <Box width="100%">
        <Typography variant="h5">{`Q${props.question.number}`}</Typography>
      </Box>
      <Box>
        <Typography variant="h6" component="span">
          {props.question.prompt}
        </Typography>
      </Box>
    </Grid>
  );
};

export default QuestionBox;
