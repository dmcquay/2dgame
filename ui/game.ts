// import { render } from "./canvas-renderer";

// export interface GameState {
//   playerCell: [0, 0];
// }

// function buildInitialState(): GameState {
//   return {
//     playerCell: [0, 0]
//   };
// }

// export function run() {
//   const state = buildInitialState();
//   const renderWithArgs = () => render(state);
//   setInterval(renderWithArgs, 1000);
//   window.addEventListener("resize", renderWithArgs);
// }

import io from "socket.io-client";

export function run() {
  console.log("starting game...");
  const socket = io("http://localhost:3001");

  socket.on("connect", function() {
    console.log("connected");
    socket.emit("action", { foo: "hello world" });
  });
  socket.on("gameState", function(data: any) {
    console.log("received gameState", data);
  });
  socket.on("disconnect", function() {
    console.log("disconnected");
  });
}
