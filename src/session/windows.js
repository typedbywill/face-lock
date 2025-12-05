import { exec } from "child_process";

export function createWindowsSession() {
  return {
    async isLocked() {
      // Windows não tem API CLI nativa simples → considere sempre "false"
      return false;
    },

    async lock() {
      exec("rundll32.exe user32.dll,LockWorkStation");
    }
  };
}