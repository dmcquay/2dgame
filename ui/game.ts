import uuid from "uuid";
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

const keyIsDownMap: { [key: string]: boolean } = {};

export function run() {
  const playerId = uuid.v4();
  const socket = io(`http://${document.location.hostname}:3001`);

  function join() {
    socket.emit("join", { id: playerId, name: playerId });
    // let message = "What is your name?";
    // if (name) message = `${name} is already taken. Please choose another name.`;
    // customPrompt(message, (value: string) => {
    //   name = value;
    //   socket.emit("join", { id: playerId, name });
    // });
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
    render(data);
  });
  socket.on("disconnect", function() {
    console.log("disconnected");
  });

  window.addEventListener("keydown", event => {
    if (keyIsDownMap[event.key] === true) return;
    keyIsDownMap[event.key] = true;
    if (!/^Arrow(Up|Down|Left|Right)$/.test(event.key)) {
      return;
    }
    const direction = event.key.replace("Arrow", "").toLowerCase();
    console.log("start moving", direction);
    socket.emit("startMoving", { direction });
  });

  window.addEventListener("keyup", event => {
    if (keyIsDownMap[event.key] === false) return;
    keyIsDownMap[event.key] = false;
    if (!/^Arrow(Up|Down|Left|Right)$/.test(event.key)) {
      return;
    }
    const direction = event.key.replace("Arrow", "").toLowerCase();
    console.log("stop moving", direction);
    socket.emit("stopMoving", { direction });
  });
}
