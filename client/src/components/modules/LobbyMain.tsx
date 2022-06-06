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
  LobbyRoom,
  LobbyLevel,
  Score,
  createRoomRequestBodyType,
} from "../../../../shared/apiTypes";

import RoomList from "./RoomList";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

type LobbyMainProps = {
  level: LobbyLevel;
  rooms: LobbyRoom[];
};

const LobbyMain = (props: LobbyMainProps) => {
  const newRoom = () => {
    const body: createRoomRequestBodyType = { private: false, levelId: props.level._id };
    post("/api/createRoom", body);
  };
  return (
    <Grid container direction="column">
      {props.level && (
        <Grid container direction="row" width="100%">
          <Box width="50%">
            <Button fullWidth color="primary" onClick={newRoom}>
              {`New ${props.level.title} Game`}
            </Button>
          </Box>
          <Box width="50%">
            <Button fullWidth color="inherit">
              Private Game
            </Button>
          </Box>
        </Grid>
      )}
      <RoomList
        rooms={props.rooms.sort((a, b) => {
          return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
        })}
      />
    </Grid>
  );
};

export default LobbyMain;
