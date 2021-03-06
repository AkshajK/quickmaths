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
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LobbyLeaderboard from "./LobbyLeaderboard";
import UserInfo from "./UserInfo";
type LobbySideBarProps = {
  levelId: string;
  levels: LobbyLevel[];
  setLevelId: (levelId: string) => void;
  leaderboard: Leaderboard;
  userInfo?: { _id: string; name: string; rating: number; highScore: number };
};

const LobbySideBar = (props: LobbySideBarProps) => {
  const { levelId, levels, setLevelId, leaderboard } = props;
  return (
    <Grid container direction="column">
      <Typography variant="h4" align="center" color="#306AFF" fontWeight="bold" marginBottom="10px">
        QuickMaths
      </Typography>

      <Box>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Level</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={levelId}
            label="Level"
            onChange={(event: SelectChangeEvent) => {
              setLevelId(event.target.value);
            }}
          >
            {levels.map((level) => (
              <MenuItem key={level._id} value={level._id}>
                {level.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {props.userInfo && (
        <UserInfo
          name={props.userInfo.name}
          rating={props.userInfo.rating}
          highScore={props.userInfo.highScore}
        />
      )}
      <LobbyLeaderboard leaderboard={leaderboard} />
    </Grid>
  );
};

export default LobbySideBar;
