import { expect } from "chai";

import {
  modifyVelocity,
  buildPlayer,
  modifyHeading,
  VELOCITY_CHANGE_PER_INTERVAL,
  MAX_VELOCITY,
  HEADING_CHANGE_PER_INTERVAL
} from "./state-utils";

const buildTestPlayer = () => buildPlayer("test-player-id", "Test Player");

describe("state-utils", () => {
  describe("#modifyVelocity", () => {
    it("when accelerating forward and velocity has not reached max", () => {
      const player = buildTestPlayer();
      player.acceleratingForward = true;
      player.velocity = 0;
      const newPlayer = modifyVelocity(player);
      expect(newPlayer.velocity).to.equal(VELOCITY_CHANGE_PER_INTERVAL);
    });

    it("when accelerating backweard and velocity has not reached max", () => {
      const player = buildTestPlayer();
      player.acceleratingBackward = true;
      player.velocity = 0;
      const newPlayer = modifyVelocity(player);
      expect(newPlayer.velocity).to.equal(VELOCITY_CHANGE_PER_INTERVAL * -1);
    });

    it("when accelerating forward and velocity has reached max", () => {
      const player = buildTestPlayer();
      player.acceleratingForward = true;
      player.velocity = MAX_VELOCITY;
      const newPlayer = modifyVelocity(player);
      expect(newPlayer.velocity).to.equal(MAX_VELOCITY);
    });

    it("when accelerating backward and velocity has reached min", () => {
      const player = buildTestPlayer();
      player.acceleratingBackward = true;
      player.velocity = MAX_VELOCITY * -1;
      const newPlayer = modifyVelocity(player);
      expect(newPlayer.velocity).to.equal(MAX_VELOCITY * -1);
    });

    it("when accelerating forward and velocity has not reached max, but next interval would put it over max", () => {
      const player = buildTestPlayer();
      player.acceleratingForward = true;
      player.velocity = MAX_VELOCITY - VELOCITY_CHANGE_PER_INTERVAL / 2;
      const newPlayer = modifyVelocity(player);
      expect(newPlayer.velocity).to.equal(MAX_VELOCITY);
    });

    it("when accelerating backward and velocity has not reached max, but next interval would put it over max", () => {
      const player = buildTestPlayer();
      player.acceleratingBackward = true;
      player.velocity = MAX_VELOCITY * -1 + VELOCITY_CHANGE_PER_INTERVAL / 2;
      const newPlayer = modifyVelocity(player);
      expect(newPlayer.velocity).to.equal(MAX_VELOCITY * -1);
    });

    it("when not accelerating and velocity is 0", () => {
      const player = buildTestPlayer();
      const newPlayer = modifyVelocity(player);
      expect(newPlayer.velocity).to.equal(0);
    });

    it("when not accelerating and velocity is < 0", () => {
      const player = buildTestPlayer();
      player.velocity = MAX_VELOCITY * -1;
      const newPlayer = modifyVelocity(player);
      expect(newPlayer.velocity).to.equal(
        MAX_VELOCITY * -1 + VELOCITY_CHANGE_PER_INTERVAL
      );
    });

    it("when not accelerating and velocity is 0", () => {
      const player = buildTestPlayer();
      const newPlayer = modifyVelocity(player);
      expect(newPlayer.velocity).to.equal(0);
    });

    it("when not accelerating and velocity is > 0", () => {
      const player = buildTestPlayer();
      player.velocity = MAX_VELOCITY;
      const newPlayer = modifyVelocity(player);
      expect(newPlayer.velocity).to.equal(
        MAX_VELOCITY - VELOCITY_CHANGE_PER_INTERVAL
      );
    });
  });

  describe("#modifyHeading", () => {
    it("when turning left", () => {
      const player = buildTestPlayer();
      player.headingDegrees = 0;
      player.turningLeft = true;
      const updatedPlayer = modifyHeading(player);
      expect(updatedPlayer.headingDegrees).to.equal(
        HEADING_CHANGE_PER_INTERVAL
      );
    });

    it("when turning left and next increment will set value beyond 360", () => {
      const player = buildTestPlayer();
      player.headingDegrees = 359;
      player.turningLeft = true;
      const updatedPlayer = modifyHeading(player);
      expect(updatedPlayer.headingDegrees).to.equal(
        HEADING_CHANGE_PER_INTERVAL - 1
      );
    });

    it("when turning right", () => {
      const player = buildTestPlayer();
      player.headingDegrees = 360;
      player.turningRight = true;
      const updatedPlayer = modifyHeading(player);
      expect(updatedPlayer.headingDegrees).to.equal(
        360 - HEADING_CHANGE_PER_INTERVAL
      );
    });

    it("when turning right and next increment will set value lower than 0", () => {
      const player = buildTestPlayer();
      player.headingDegrees = 1;
      player.turningRight = true;
      const updatedPlayer = modifyHeading(player);
      expect(updatedPlayer.headingDegrees).to.equal(
        360 - HEADING_CHANGE_PER_INTERVAL + 1
      );
    });

    it("when not turning", () => {
      const player = buildTestPlayer();
      player.headingDegrees = 0;
      const updatedPlayer = modifyHeading(player);
      expect(updatedPlayer.headingDegrees).to.equal(0);
    });
  });
});
