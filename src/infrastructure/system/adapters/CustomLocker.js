import { exec } from "child_process";

export class CustomLocker {
    constructor(lockCommand) {
        this.lockCommand = lockCommand;
    }

    async isLocked() {
        return false;
    }

    async lock() {
        if (this.lockCommand) {
            exec(this.lockCommand);
        }
    }
}
