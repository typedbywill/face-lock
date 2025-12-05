import os from "os";
import { LinuxLocker } from "./adapters/LinuxLocker.js";
import { WindowsLocker } from "./adapters/WindowsLocker.js";
import { MacLocker } from "./adapters/MacLocker.js";
import { CustomLocker } from "./adapters/CustomLocker.js";

export class SystemLockFactory {
    static create(config) {
        if (config.lock.mode === "command" && config.lock.lockCommand) {
            return new CustomLocker(config.lock.lockCommand);
        }

        const platform = os.platform();

        if (platform === "linux") return new LinuxLocker();
        if (platform === "win32") return new WindowsLocker();
        if (platform === "darwin") return new MacLocker();

        throw new Error(`Sistema operacional não suportado: ${platform}`);
    }
}
