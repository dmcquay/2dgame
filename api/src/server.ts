import SocketIo from "socket.io";
import * as R from "ramda";

interface PlayerState {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  moving: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
  };
}

interface PlayerMap {
  [key: string]: PlayerState;
}

interface GameState {
  players: PlayerMap;
}

let gameState: GameState = {
  players: {}
};

const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

function getAvailableColor() {
  return colors.filter(
    color => !Object.values(gameState.players).find(p => p.color === color)
  )[0];
}

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
    const newPlayer: PlayerState = {
      id,
      name,
      color: getAvailableColor(),
      x: Math.floor(Math.random() * 800) - 400,
      y: Math.floor(Math.random() * 600) - 300,
      moving: {
        up: false,
        down: false,
        left: false,
        right: false
      }
    };
    gameState = {
      ...gameState,
      players: { ...gameState.players, [id]: newPlayer }
    };
    io.emit("gameState", gameState);
    io.emit("playerJoined", { id, name });
    playerId = id;
  });
  // client.on("startMoving", (data: any) => {
  //   const { direction: string } = data;
  //   R.set(R.lensPath([]));
  // });
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

// start game, return game state
// join game by id
// start moving (direction)
