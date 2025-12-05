import { loadModels } from "./face-utils.js";

export class ModelLoader {
    constructor(modelPath) {
        this.modelPath = modelPath;
        this.loaded = false;
    }

    async loadOnce() {
        if (this.loaded) return;
        await loadModels(this.modelPath);
        this.loaded = true;
    }
}
