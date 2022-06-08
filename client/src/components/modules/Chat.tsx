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
  messageRequestBodyType,
} from "../../../../shared/apiTypes";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";

import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";

type ChatProps = {
  messages: Message[];
  roomId: string;
};

const Chat = (props: ChatProps) => {
  const [messageText, setMessageText] = useState<string>("");
  const [lastMessage, setLastMessage] = useState<Date>(new Date());
  const name = (message: Message) => (
    <div style={{ color: "#6c57f5", display: "inline", fontWeight: "900" }}>{message.userName}</div>
  );
  const text = (message: Message) => <div style={{ display: "inline" }}>{": " + message.text}</div>;
  return (
    <Grid container direction="column">
      <Box display="flex" flexDirection="column-reverse" overflow="auto" marginBottom="auto">
        <List>
          {props.messages.map((message) => (
            <ListItem dense>
              <ListItemText>
                {name(message)} {text(message)}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Box>
      <TextField
        label="Message"
        variant="outlined"
        size="small"
        value={messageText}
        fullWidth
        onChange={(event) => {
          setMessageText(event.target.value);
        }}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            if (new Date().getTime() - new Date(lastMessage).getTime() >= 500) {
              setLastMessage(new Date());
              const body: messageRequestBodyType = {
                roomId: props.roomId,
                text: messageText,
                kind: "text",
              };
              post("/api/message", body).then(() => {
                setMessageText("");
              });
            }
          }
        }}
      />
    </Grid>
  );
};

export default Chat;
