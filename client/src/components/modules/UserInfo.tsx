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
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {props.name}
        </Typography>
        <Grid container direction="column" width="100%">
          <Box width="50%">
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Rating
            </Typography>
            <Typography variant="h5" component="div" gutterBottom color="#306AFF">
              {props.rating}
            </Typography>
          </Box>
          <Box width="50%">
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              High Score
            </Typography>
            <Typography variant="h5" component="div" gutterBottom color="#306AFF">
              {props.highScore}
            </Typography>
          </Box>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
