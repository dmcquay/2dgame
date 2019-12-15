import SocketIo from "socket.io";

interface PlayerState {
  name: string;
  color: string;
  x: number;
  y: number;
}

interface GameState {
  players: PlayerState[];
}

let gameState: GameState = {
  players: []
};

const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

function getAvailableColor() {
  return colors.filter(
    color => !gameState.players.find(p => p.color === color)
  )[0];
}

const io = SocketIo();
io.on("connection", client => {
  let clientName = "";
  console.log("client connected");
  client.on("action", data => {
    console.log("received action", data);
    io.emit("gameState", gameState);
  });
  client.on("join", ({ name }) => {
    if (gameState.players.filter(p => p.name === name).length > 0) {
      client.emit("nameUnavailable");
      return;
    }
    const newPlayer: PlayerState = {
      name,
      color: getAvailableColor(),
      x: Math.floor(Math.random() * 800) - 400,
      y: Math.floor(Math.random() * 600) - 300
    };
    gameState = { ...gameState, players: [...gameState.players, newPlayer] };
    io.emit("gameState", gameState);
    io.emit("playerJoined", { name });
    clientName = name;
  });
  client.on("message", data => {
    console.log("received message", data);
  });
  client.on("disconnect", () => {
    console.log("client disconnected");
    gameState = {
      ...gameState,
      players: [...gameState.players.filter(p => p.name !== clientName)]
    };
    io.emit("gameState", gameState);
    io.emit("playerLeft", { name: clientName });
  });
});
io.listen(3001);

// start game, return game state
// join game by id
// start moving (direction)
