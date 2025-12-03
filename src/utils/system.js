import util from "util";
import { exec } from "child_process";
const execAsync = util.promisify(exec);

export async function isLocked() {
  try {
    const sessionId = process.env.XDG_SESSION_ID;
    const { stdout } = await execAsync(
      `loginctl show-session ${sessionId} -p LockedHint`
    );
    return stdout.includes("yes");
  } catch {
    return false;
  }
}

export function lockSession() {
  exec("loginctl lock-session");
}