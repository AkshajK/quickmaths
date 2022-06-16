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
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import { Progress } from "antd";
type TimerProps = {
  endTime: Date;
  totalSeconds: number;
  backwards?: boolean;
};

const Timer = (props: TimerProps) => {
  const [percentage, setPercentage] = useState(100);
  useEffect(() => {
    const interval = setInterval(
      () => {
        const newPercentage = Math.min(
          100,
          Math.max(
            0,
            ((new Date(props.endTime).getTime() - new Date().getTime()) /
              props.totalSeconds /
              1000) *
              100
          )
        );
        setPercentage(props.backwards ? newPercentage : 100 - newPercentage);
      },
      props.totalSeconds < 5 ? 10 : 50
    );
    return () => {
      clearInterval(interval);
    };
  }, [props.endTime, props.totalSeconds]);
  const color = `hsl(${Math.floor(new Date().getTime() / 50) % 360}, 100%, 50%)`;
  return (
    <Grid container direction="column" width="100%" justifyContent="center">
      <Progress
        percent={percentage}
        showInfo={false}
        strokeLinecap="round"
        trailColor="#616161"
        strokeColor={color}
        strokeWidth={20}
        style={{ marginTop: "-20px", marginBottom: "5px", marginLeft: "-20px" }}
      />
    </Grid>
  );
};

export default Timer;
