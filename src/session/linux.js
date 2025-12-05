import { exec } from "child_process";
import util from "util";
const execAsync = util.promisify(exec);

export function createLinuxSession() {
  return {
    async isLocked() {
      try {
        const { stdout } = await execAsync("loginctl show-session $(loginctl | awk 'NR==2{print $1}') -p LockedHint");
        return stdout.includes("yes");
      } catch {
        return false;
      }
    },

    async lock() {
      exec("loginctl lock-session", () => { });
    }
  };
}