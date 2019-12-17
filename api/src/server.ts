import SocketIo from "socket.io";
import * as R from "ramda";

import { headingAndVelocityToVector, addVectorToPoint } from "./geometry2d";
import {
  buildInitialGameState,
  addPlayer,
  modifyVelocity,
  modifyHeading
} from "./state-utils";

let gameState = buildInitialGameState();

const io = SocketIo();
io.on("connection", client => {
  let playerId: string;
  console.log("client connected");

  client.on("action", data => {
    console.log("received action", data);
    io.emit("gameState", gameState);
  });

  client.on("join", ({ id, name }) => {
    if (
      Object.values(gameState.players).filter(p => p.name === name).length > 0
    ) {
      client.emit("nameUnavailable");
      return;
    }
    gameState = addPlayer(id, name, gameState);
    io.emit("gameState", gameState);
    io.emit("playerJoined", { id, name });
    playerId = id;
  });

  client.on("startAcceleratingForward", () => {
    gameState = R.set(
      R.lensPath(["players", playerId, "acceleratingForward"]),
      true,
      gameState
    );
    io.emit("gameState", gameState);
  });

  client.on("stopAcceleratingForward", () => {
    gameState = R.set(
      R.lensPath(["players", playerId, "acceleratingForward"]),
      false,
      gameState
    );
    io.emit("gameState", gameState);
  });

  client.on("startAcceleratingBackward", () => {
    gameState = R.set(
      R.lensPath(["players", playerId, "acceleratingBackward"]),
      true,
      gameState
    );
    io.emit("gameState", gameState);
  });

  client.on("stopAcceleratingBackward", () => {
    gameState = R.set(
      R.lensPath(["players", playerId, "acceleratingBackward"]),
      false,
      gameState
    );
    io.emit("gameState", gameState);
  });

  client.on("startTurningLeft", () => {
    gameState = R.set(
      R.lensPath(["players", playerId, "turningLeft"]),
      true,
      gameState
    );
    io.emit("gameState", gameState);
  });

  client.on("stopTurningLeft", () => {
    gameState = R.set(
      R.lensPath(["players", playerId, "turningLeft"]),
      false,
      gameState
    );
    io.emit("gameState", gameState);
  });

  client.on("startTurningRight", () => {
    gameState = R.set(
      R.lensPath(["players", playerId, "turningRight"]),
      true,
      gameState
    );
    io.emit("gameState", gameState);
  });

  client.on("stopTurningRight", () => {
    gameState = R.set(
      R.lensPath(["players", playerId, "turningRight"]),
      false,
      gameState
    );
    io.emit("gameState", gameState);
  });

  client.on("disconnect", () => {
    console.log("client disconnected");
    if (!gameState.players[playerId]) return;
    const playerName = gameState.players[playerId].name;
    gameState = {
      ...gameState,
      players: R.omit([playerId], gameState.players)
    };
    io.emit("gameState", gameState);
    io.emit("playerLeft", { name: playerName, id: playerId });
  });
});

io.listen(3001);

function movePlayers() {
  const playerIds = Object.keys(gameState.players);
  playerIds.forEach(movePlayer);
  io.emit("gameState", gameState);
}

function movePlayer(playerId: string) {
  let player = gameState.players[playerId];

  player = modifyHeading(player);
  player = modifyVelocity(player);

  const vector = headingAndVelocityToVector(
    player.headingDegrees,
    player.velocity
  );
  const startPoint = { x: player.x, y: player.y };
  const endPoint = addVectorToPoint(startPoint, vector);
  player.x = endPoint.x;
  player.y = endPoint.y;

  gameState = R.set(R.lensPath(["players", playerId]), player, gameState);
}

setInterval(movePlayers, 20);
