import { exec } from "child_process";

export function createCustomSession(command) {
  return {
    async isLocked() {
      return false;
    },

    async lock() {
      exec(command);
    }
  };
}