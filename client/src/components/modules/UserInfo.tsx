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

type UserInfoProps = {
  name: string;
  rating: number;
  highScore: number;
};

const UserInfo = (props: UserInfoProps) => {
  return <div></div>;
};

export default UserInfo;
