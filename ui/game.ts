import { render } from "./canvas-renderer";
import { GameState } from "./types";

import io from "socket.io-client";

let name = "";

function customPrompt(message: string, cb: Function) {
  const p = document.createElement("p");
  p.innerText = message;
  const input = document.createElement("input");
  input.type = "text";
  const btn = document.createElement("button");
  btn.innerText = "Join Game";
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "100px";
  container.style.left = "100px";
  container.appendChild(p);
  container.appendChild(input);
  container.appendChild(btn);
  btn.addEventListener("click", () => {
    const val = input.value;
    document.body.removeChild(container);
    cb(val);
  });
  document.body.appendChild(container);
}

export function run() {
  console.log("starting game...");
  const socket = io("http://localhost:3001");

  function join() {
    let message = "What is your name?";
    if (name) message = `${name} is already taken. Please choose another name.`;
    customPrompt(message, (value: string) => {
      name = value;
      socket.emit("join", { name });
    });
  }

  socket.on("connect", function() {
    console.log("connected");
    join();
  });
  socket.on("nameUnavailable", () => {
    join();
  });
  socket.on("playerJoined", (data: any) => {
    const { name: joinedName } = data;
    if (joinedName === name) {
      return;
    }
    console.log(`${joinedName} has joined the game`);
  });
  socket.on("playerLeft", (data: any) => {
    const { name: leftName } = data;
    console.log(`${leftName} has left the game`);
  });
  socket.on("gameState", function(data: GameState) {
    console.log("received gameState", data);
    render(data);
  });
  socket.on("disconnect", function() {
    console.log("disconnected");
  });
}
