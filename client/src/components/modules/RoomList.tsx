import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";
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
  Score,
} from "../../../../shared/apiTypes";
import { styled } from "@mui/material/styles";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#FFFFFF",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

type RoomListProps = {
  rooms: LobbyRoom[];
};

const RoomList = (props: RoomListProps) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Room Name</StyledTableCell>
            <StyledTableCell align="right">Status</StyledTableCell>
            <StyledTableCell align="right">Players</StyledTableCell>
            <StyledTableCell align="right">Last active</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rooms.map((room) => (
            <StyledTableRow
              hover={true}
              key={room.name}
              onClick={() => {
                navigate(`/${room.name}`);
              }}
            >
              <StyledTableCell component="th" scope="row">
                {room.levelName}
              </StyledTableCell>
              <StyledTableCell align="right">
                {room.inProgress ? "In Progress" : "Open"}
              </StyledTableCell>
              <StyledTableCell align="right">{`${room.players} players`}</StyledTableCell>
              <StyledTableCell align="right">
                {new Date(room.lastActive).toDateString()}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RoomList;
