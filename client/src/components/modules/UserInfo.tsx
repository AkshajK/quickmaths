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
} from "../../../../shared/apiTypes";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

type UserInfoProps = {
  name: string;
  rating: number;
  highScore: number;
};

const UserInfo = (props: UserInfoProps) => {
  return (
    <Box margin="10px" marginTop="20px" marginBottom="0px">
      <Typography variant="h5" component="div" gutterBottom>
        {props.name}
      </Typography>
      <Grid container direction="row" width="100%">
        <Box width="50%">
          <Typography sx={{ mb: 0.5 }} color="text.secondary">
            Rating
          </Typography>
          <Typography variant="h5" component="div" color="#306AFF">
            {Math.round(props.rating)}
          </Typography>
        </Box>
        <Box width="50%">
          <Typography sx={{ mb: 0.5 }} color="text.secondary">
            High Score
          </Typography>
          <Typography variant="h5" component="div" color="#306AFF">
            {props.highScore}
          </Typography>
        </Box>
      </Grid>
    </Box>
  );
};

export default UserInfo;
