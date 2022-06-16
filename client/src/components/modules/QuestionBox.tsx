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
import TextField from "@mui/material/TextField";

type QuestionBoxProps = {
  question?: Question;
  guess: (guess: string) => void;
};

const QuestionBox = (props: QuestionBoxProps) => {
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [lastGuess, setLastGuess] = useState<Date>(new Date());

  return (
    <Grid container direction="column" justifyContent="center">
      <Box width="100%" marginTop="10px">
        <Typography variant="h6" color="#306AFF">{`Question ${
          props.question?.number + 1
        }`}</Typography>
      </Box>
      <Box marginTop="10px" marginBottom="10px">
        <Typography variant="h5" component="span">
          {props.question?.prompt}
        </Typography>
      </Box>
      <TextField
        label="Answer"
        value={userAnswer}
        onChange={(event) => {
          setUserAnswer(event.target.value);
        }}
        autoFocus
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            if (new Date().getTime() - new Date(lastGuess).getTime() >= 100) {
              setUserAnswer("");
              props.guess(userAnswer);
            }
          }
        }}
      />
    </Grid>
  );
};

export default QuestionBox;
