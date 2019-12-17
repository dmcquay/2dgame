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

  function emitAndLog(eventName: string) {
    socket.emit(eventName);
    console.log("emitting", eventName);
  }

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
  let gameState: GameState | undefined = undefined;
  socket.on("gameState", function(data: GameState) {
    if (gameState && gameState.players[playerId]) {
      if (
        gameState.players[playerId].headingDegrees !==
        data.players[playerId].headingDegrees
      ) {
        console.log("heading", data.players[playerId].headingDegrees);
      }

      if (
        gameState.players[playerId].velocity !== data.players[playerId].velocity
      ) {
        console.log("velocity", data.players[playerId].velocity);
      }
    }
    gameState = data;
    render(data);
  });
  socket.on("disconnect", function() {
    console.log("disconnected");
  });

  window.addEventListener("keydown", event => {
    if (keyIsDownMap[event.key] === true) return;
    keyIsDownMap[event.key] = true;

    if (event.key === "ArrowUp") {
      emitAndLog("startAcceleratingForward");
    } else if (event.key === "ArrowDown") {
      emitAndLog("startAcceleratingBackward");
    } else if (event.key === "ArrowLeft") {
      emitAndLog("startTurningLeft");
    } else if (event.key === "ArrowRight") {
      emitAndLog("startTurningRight");
    }
  });

  window.addEventListener("keyup", event => {
    if (keyIsDownMap[event.key] === false) return;
    keyIsDownMap[event.key] = false;

    if (event.key === "ArrowUp") {
      emitAndLog("stopAcceleratingForward");
    } else if (event.key === "ArrowDown") {
      emitAndLog("stopAcceleratingBackward");
    } else if (event.key === "ArrowLeft") {
      emitAndLog("stopTurningLeft");
    } else if (event.key === "ArrowRight") {
      emitAndLog("stopTurningRight");
    }
  });
}
