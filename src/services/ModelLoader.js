// services/ModelLoader.js
import { loadModels } from "../utils/face.js";

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