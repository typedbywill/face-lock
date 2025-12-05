import os from "os";
import { createLinuxSession } from "./linux.js";
import { createWindowsSession } from "./windows.js";
import { createMacSession } from "./mac.js";
import { createCustomSession } from "./custom.js";

export function createSessionManager(config) {

  if (config.lock.mode === "command" && config.lock.lockCommand) {
    return createCustomSession(config.lock.lockCommand);
  }

  const platform = os.platform();

  if (platform === "linux") return createLinuxSession();
  if (platform === "win32") return createWindowsSession();
  if (platform === "darwin") return createMacSession();

  throw new Error(`Sistema operacional não suportado: ${platform}`);

}