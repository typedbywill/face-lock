import util from "util";
import { exec } from "child_process";
import debug from "./debug.js";

const execAsync = util.promisify(exec);

// Obtém o sessionId automaticamente (GNOME/KDE/Wayland/X11)
async function getSessionId() {
  try {
    const cmd = `loginctl show-user ${process.env.USER} -p Sessions`;
    debug(`[getSessionId] Executando: ${cmd}`);

    const { stdout } = await execAsync(cmd);
    debug(`[getSessionId] Retorno bruto: "${stdout.trim()}"`);

    const match = stdout.match(/Sessions=(.*)/);
    if (!match) return null;

    const sessions = match[1].trim().split(/\s+/);
    const sessionId = sessions[0];

    debug(`[getSessionId] Sessions detectadas: ${sessions}`);
    debug(`[getSessionId] Usando sessionId: ${sessionId}`);

    return sessionId;

  } catch (err) {
    debug(`[getSessionId] ERRO ao obter Sessions: ${err.message}`);
    return null;
  }
}

export async function isLocked() {
  try {
    const sessionId = await getSessionId();
    if (!sessionId) {
      debug("[isLocked] Nenhuma sessão encontrada!");
      return false;
    }

    const cmd = `loginctl show-session ${sessionId} -p LockedHint`;
    debug(`[isLocked] Executando comando: ${cmd}`);

    const { stdout } = await execAsync(cmd);

    debug(`[isLocked] Retorno bruto: "${stdout.trim()}"`);

    const locked = stdout.includes("yes");

    debug(`[isLocked] LockedHint interpretado como: ${locked}`);

    return locked;

  } catch (err) {
    debug(`[isLocked] ERRO ao executar loginctl: ${err.message}`);
    return false;
  }
}

export function lockSession() {
  debug(`[lockSession] Executando lock de sessão…`);

  exec("loginctl lock-session", (err) => {
    if (err) {
      debug(`[lockSession] ERRO ao bloquear sessão: ${err.message}`);
    } else {
      debug(`[lockSession] Sessão bloqueada com sucesso.`);
    }
  });
}