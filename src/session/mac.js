import { exec } from "child_process";

export function createMacSession() {
  return {
    async isLocked() {
      return false; // macOS não expõe status facilmente
    },

    async lock() {
      exec(`osascript -e 'tell application "System Events" to keystroke "q" using {control down, command down}'`);
    }
  };
}