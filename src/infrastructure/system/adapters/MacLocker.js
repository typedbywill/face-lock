import { exec } from "child_process";

export class MacLocker {
    async isLocked() {
        // Difícil detectar lock screen no mac sem permissões ou API nativa
        return false;
    }

    async lock() {
        exec("/System/Library/CoreServices/Menu\\ Extras/User.menu/Contents/Resources/CGSession -suspend");
    }
}
