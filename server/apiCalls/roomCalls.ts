import {
  User,
  Game,
  Level,
  Message,
  Question,
  QuestionType,
  Room,
  Score,
  RoomUser,
} from "../../shared/apiTypes";

import * as _ from "lodash";

import {
  TypedRequestBody,
  TypedResponse,
  guessRequestBodyType,
  guessResponseType,
  joinRoomPageRequestBodyType,
  joinRoomPageResponseType,
  joinRoomPageSocketEmitType,
  messageRequestBodyType,
  messageResponseType,
  startGameRequestBodyType,
  startGameResponseType,
  lock,
  messageSocketEmitType,
  startGameSocketEmitType,
  guessSocketEmitType,
  getLobbyRoom,
  removeUserFromRoom,
} from "../../shared/apiTypes";
import mongoose from "mongoose";
import UserModel from "../models/user";
import RoomModel from "../models/room";
import GameModel from "../models/game";
import LevelModel from "../models/level";
import QuestionModel from "../models/question";
import MessageModel from "../models/message";
import socketManager from "../server-socket";

const fromNow = (seconds: number): Date => new Date(new Date().getTime() + seconds * 1000);
const fromTime = (date: Date, seconds: number): Date =>
  new Date(new Date(date).getTime() + seconds * 1000);

const initializeRooms = async () => {
  const rooms = await RoomModel.find({});
  await Promise.all(
    rooms.map((room) => {
      lock.acquire(room._id, async () => {
        room.gameId = room.gameId.concat(["server died"]);
        room.users = [];
        room.spectatingUsers = [];
        room.inProgress = false;
        await room.save();
      });
    })
  );
};

const joinRoomPage = async (
  req: TypedRequestBody<joinRoomPageRequestBodyType>,
  res: TypedResponse<joinRoomPageResponseType | string>
) => {
  const myUserId: string = req.user?._id as string;
  console.log(`My user id: ${myUserId}`);
  let room: Room = (await RoomModel.findOne({ name: req.body.roomName })) as Room;
  lock.acquire(room._id, async () => {
    room = (await RoomModel.findOne({ name: req.body.roomName })) as Room;
    const user = (await UserModel.findById(myUserId)) as User;
    if (user.roomId !== "Lobby") {
      // Remove user from the old room
      const oldRoom: Room = (await RoomModel.findById(user.roomId)) as Room;
      await removeUserFromRoom(oldRoom, user._id, socketManager.getIo());
    }
    user.roomId = room._id;
    await user.save();
    if (req.body.spectating) {
      if (room.spectatingUsers.find((user) => user === myUserId)) {
        console.log("Spectating room that you are already spectating?");
      } else {
        room.spectatingUsers = room.spectatingUsers.concat(myUserId);
      }
    } else {
      if (room.users.find((user) => user === myUserId)) {
        console.log("Joining room that you are already in?");
      } else {
        room.users = room.users.concat(myUserId);
      }
    }
    socketManager.getSocketFromUserID(myUserId)?.join("" + room._id);
    const gameId = room.gameId.slice(-1)[0];
    const game: Game | undefined =
      (gameId !== undefined &&
        gameId !== "server died" &&
        ((await GameModel.findById(gameId)) as Game)) ||
      undefined;
    const level = (await LevelModel.findById(room.levelId)) as Level;
    const status = !game ? "waiting" : game.status;
    const yourScore = game?.scores?.find((score) => score.userId === myUserId)?.score || 0;
    const questionId =
      status === "inProgress" &&
      yourScore &&
      game &&
      game.questions &&
      yourScore < game.questions.length &&
      game.questions[yourScore];
    const question =
      (questionId && ((await QuestionModel.findById(questionId)) as Question)) || undefined;
    const data: joinRoomPageSocketEmitType = {
      roomName: room.name,
      user: {
        name: user.name,
        _id: user._id,
        rating: user.data.find((entry) => entry.levelId === level._id)?.rating || 1200,
      },
      spectating: req.body.spectating,
    };
    const roomUsers: RoomUser[] = (await UserModel.find({ _id: { $in: room.users } })).map(
      (user) => ({
        name: user.name,
        rating: user.data.find((entry) => entry.levelId === level._id)?.rating || 1200,
        _id: user._id,
      })
    );
    const roomSpectatingUsers: RoomUser[] = (
      await UserModel.find({ _id: { $in: room.spectatingUsers } })
    ).map((user) => ({
      name: user.name,
      rating: user.data.find((entry) => entry.levelId === level._id)?.rating || 1200,
      _id: user._id,
    }));
    _.unset(question, "answer");
    socketManager
      .getIo()
      .in("" + room._id)
      .emit("joinRoomPage", data);
    const updatedRoom = await getLobbyRoom(room, level.title);
    socketManager.getIo().in("Lobby").emit("updateRoom", updatedRoom);
    await room.save();
    res.status(200).json({
      status,
      roomId: room._id,
      levelName: level.title,
      users: roomUsers,
      spectatingUsers: roomSpectatingUsers,
      spectating: req.body.spectating || (status === "inProgress" && !question),
      question: question,
      startTime: (game && !(game.status === "complete") && game.startTime) || undefined,
      scores: game?.scores,
    });
  });
};
const timeLimit = 30;
const startGame = (
  req: TypedRequestBody<startGameRequestBodyType>,
  res: TypedResponse<startGameResponseType>
) => {
  const myUserId: string = req.user?._id as string;
  lock.acquire(req.body.roomId, async () => {
    const room: Room = (await RoomModel.findById(req.body.roomId)) as Room;
    if (room.inProgress) return;
    const level: Level = (await LevelModel.findById(room.levelId)) as Level;
    const roomUsers = (await UserModel.find({ _id: { $in: room.users } })) as User[];
    /** TODO: Replace with actual question generation code */
    var questions = [];
    for (var i = 0; i < 100; i++) {
      const a = Math.floor(Math.random() * 100);
      const b = Math.floor(Math.random() * 100);
      const question = new QuestionModel({
        number: i,
        prompt: `What is ${a} + ${b}?`,
        answer: "" + (a + b),
        questionTypeId: "",
      });
      questions.push(question.save());
    }
    const savedQuestions: Question[] = await Promise.all(questions);
    /** END TODO */
    const startTime = fromNow(3);
    const scores = roomUsers.map((user) => ({
      userId: user._id,
      name: user.name,
      questionNumber: 0,
      score: 0,
    }));

    const game = new GameModel({
      status: "aboutToStart",
      host: myUserId,
      questions: savedQuestions.map((q) => q._id),
      scores,
      startTime,
      timeLimit,
    });

    const savedGame = await game.save();
    room.inProgress = true;
    room.gameId = room.gameId.concat(savedGame._id);
    room.lastActive = new Date();
    await room.save();
    const data: startGameSocketEmitType = { startTime, scores };
    socketManager
      .getIo()
      .in("" + room._id)
      .emit("aboutToStart", data);
    const updatedRoom = await getLobbyRoom(room, level.title);
    socketManager.getIo().in("Lobby").emit("updateRoom", updatedRoom);
    setTimeout(() => {
      setGameToStarted(room._id, game._id);
    }, new Date(startTime).getTime() - new Date().getTime());
    setTimeout(() => {
      setGameToComplete(room._id, game._id);
    }, new Date(startTime).getTime() + timeLimit * 1000 - new Date().getTime());
    res.send({ error: false });
  });
};

const setGameToStarted = async (roomId: string, gameId: string) => {
  lock.acquire(roomId, async () => {
    const room: Room = (await RoomModel.findById(roomId)) as Room;
    const game: Game = (await GameModel.findById(gameId)) as Game;
    const question: Question = (await QuestionModel.findById(game.questions[0])) as Question;
    console.log(question);
    question.answer = undefined;
    room.inProgress = true;
    if (game.status === "inProgress") return;
    game.status = "inProgress";
    await room.save();
    await game.save();
    const updatedRoom = await getLobbyRoom(room);
    socketManager.getIo().in("Lobby").emit("updateRoom", updatedRoom);
    socketManager
      .getIo()
      .in("" + roomId)
      .emit("inProgress", { question, endTime: fromTime(game.startTime, timeLimit) });
  });
};

const setGameToComplete = async (roomId: string, gameId: string) => {
  lock.acquire(roomId, async () => {
    const room: Room = (await RoomModel.findById(roomId)) as Room;
    const game: Game = (await GameModel.findById(gameId)) as Game;
    room.inProgress = false;
    game.status = "complete";
    await room.save();
    const savedGame = await game.save();
    const updatedRoom = await getLobbyRoom(room);
    socketManager.getIo().in("Lobby").emit("updateRoom", updatedRoom);
    socketManager
      .getIo()
      .in("" + roomId)
      .emit("complete", { scores: savedGame.scores });
    await updateRatingsAndHighScores(room.levelId, savedGame.scores);
  });
};

const updateRatingsAndHighScores = async (levelId: string, scores: Score[]) => {
  const k = 60 / scores.length;
  // @ts-ignore
  const users = await UserModel.find({
    _id: { $in: scores.map((entry) => mongoose.Types.ObjectId(entry.userId)) },
  });
  const userData: Map<string, { rating: number; highScore: number; levelId: string }> = new Map<
    string,
    { rating: number; highScore: number; levelId: string }
  >();
  users.map((user) => {
    const curData = user.data.find((dataEntry) => dataEntry.levelId === levelId) || {
      rating: 1200,
      highScore: 0,
      levelId,
    };
    userData.set(user._id + "", curData);
  });
  const newRatings: Map<string, number> = new Map<string, number>();
  const scoresObj: Map<string, number> = new Map<string, number>();
  users.map((user) => {
    const currentRating = userData.get("" + user._id)?.rating || 1200;
    let update = 0.5;
    const score = scores.find((entry) => entry.userId === user._id + "")?.score || 0;
    scoresObj.set(user._id + "", score);
    scores.forEach((scoreEntry) => {
      const constant = score < scoreEntry.score ? 0 : score > scoreEntry.score ? 1 : 0.5;
      const p =
        1.0 /
        (1.0 +
          Math.pow(
            10,
            (userData.get(scoreEntry.userId + "")?.rating || 1200 - currentRating) / 400.0
          ));
      update += k * (constant - p);
    });

    newRatings.set(user._id + "", currentRating + update);
  });

  await Promise.all(
    users.map(async (user) => {
      const newDataEntry: { rating: number; highScore: number; levelId: string } = {
        rating: newRatings.get(user._id + "") || 1200,
        highScore: Math.max(
          scoresObj.get(user._id + "") || 0,
          userData.get(user._id + "")?.highScore || 0
        ),
        levelId,
      };
      user.data = user.data.filter((entry) => entry.levelId !== levelId).concat([newDataEntry]);
      await user.save();
    })
  );
  console.log(scoresObj);
  console.log(newRatings);
};

const guess = (
  req: TypedRequestBody<guessRequestBodyType>,
  res: TypedResponse<guessResponseType>
) => {
  const myUserId: string = req.user?._id as string;
  lock.acquire(req.body.roomId, async () => {
    const room: Room = (await RoomModel.findById(req.body.roomId)) as Room;
    const game: Game = (await GameModel.findById(room.gameId.slice(-1)[0])) as Game;
    const index = game.scores.findIndex((score) => score.userId === myUserId);
    const question: Question = (await QuestionModel.findById(
      game.questions[game.scores[index].questionNumber]
    )) as Question;
    const correct = question.answer === req.body.answer;
    const nextQuestion: Question | undefined =
      (correct &&
        ((await QuestionModel.findById(
          game.questions[game.scores[index].questionNumber + 1]
        )) as Question)) ||
      undefined;
    if (nextQuestion) {
      nextQuestion.answer = undefined;
    }
    game.scores[index]["questionNumber"] += correct ? 1 : 0;
    game.scores[index]["score"] += correct ? 1 : 0;
    game.markModified("scores");
    const savedGame: Game = await game.save();
    const data: guessSocketEmitType = { roomId: room._id, scores: savedGame.scores };
    socketManager
      .getIo()
      .in("" + room._id)
      .emit("guess", data);
    if (correct) {
      console.log("CORRECT!");
    } else {
      console.log(`No, ${req.body.answer} is not ${question.answer}`);
    }
    res.status(200).json({
      question: (correct && nextQuestion) || undefined,
      correct,
    });
  });
};

const message = async (
  req: TypedRequestBody<messageRequestBodyType>,
  res: TypedResponse<messageResponseType>
) => {
  const myUserId: string = req.user?._id as string;
  const user = (await UserModel.findById(myUserId)) as User;
  const newMessage = new MessageModel({
    roomId: req.body.roomId,
    text: req.body.text,
    kind: req.body.kind,
    userId: myUserId,
    userName: user.name,
  });
  const newMessageSaved = await newMessage.save();
  const data: messageSocketEmitType = { roomId: req.body.roomId, message: newMessageSaved };
  socketManager.getIo().in(req.body.roomId).emit("message", data);
  res.status(200).json({ error: false });
};

export default {
  joinRoomPage,
  startGame,
  guess,
  message,
  initializeRooms,
};
