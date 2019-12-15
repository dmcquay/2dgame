import SocketIo from "socket.io";

const io = SocketIo();
io.on("connection", client => {
  console.log("client connected");
  client.on("action", data => {
    console.log("received action", data);
    io.emit("gameState", { gameStateStuff: { foo: "bar", sentToAll: true } });
  });
  client.on("message", data => {
    console.log("received message", data);
  });
  client.on("disconnect", () => {
    console.log("client disconnected");
  });
});
io.listen(3001);

// start game, return game state
// join game by id
// start moving (direction)
