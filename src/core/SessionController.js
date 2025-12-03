// core/SessionController.js
import { isLocked, lockSession } from "../utils/system.js";
import debug from "../utils/debug.js";

export class SessionController {
  async isLocked() {
    return await isLocked();
  }

  async lock() {
    debug("Bloqueando sessão...");
    lockSession();
  }
}