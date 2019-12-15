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
  client.on("startMoving", (data: any) => {
    const { direction } = data;
    gameState = R.set(
      R.lensPath(["players", playerId, "moving", direction]),
      true,
      gameState
    );
    io.emit("gameState", gameState);
  });
  client.on("stopMoving", (data: any) => {
    const { direction } = data;
    gameState = R.set(
      R.lensPath(["players", playerId, "moving", direction]),
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
  const changed = playerIds.map(movePlayer);
  if (changed.find(x => x === true)) {
    io.emit("gameState", gameState);
  }
}

const MOVE_PX_PER_INTERVAL = 5;

function movePlayer(playerId: string) {
  const player = gameState.players[playerId];

  let x = player.x;
  if (player.moving.left) {
    x -= MOVE_PX_PER_INTERVAL;
  } else if (player.moving.right) {
    x += MOVE_PX_PER_INTERVAL;
  }

  let y = player.y;
  if (player.moving.up) {
    y -= MOVE_PX_PER_INTERVAL;
  } else if (player.moving.down) {
    y += MOVE_PX_PER_INTERVAL;
  }

  if (player.x !== x) {
    gameState = R.set(R.lensPath(["players", playerId, "x"]), x, gameState);
  }

  if (player.y !== y) {
    gameState = R.set(R.lensPath(["players", playerId, "y"]), y, gameState);
  }

  return player.x !== x || player.y !== y;
}

setInterval(movePlayers, 20);
