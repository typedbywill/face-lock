import { exec } from "child_process";
import util from "util";
const execAsync = util.promisify(exec);

export class LinuxLocker {
    async isLocked() {
        try {
            // Tenta obter o ID da sessão atual se possível, ou usa workaround
            const { stdout } = await execAsync("loginctl show-session $(loginctl | grep $(whoami) | awk '{print $1}' | head -n 1) -p LockedHint");
            return stdout.includes("yes");
        } catch (e) {
            return false;
        }
    }

    async lock() {
        exec("loginctl lock-session");
    }
}
