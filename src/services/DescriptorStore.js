// services/DescriptorStore.js
import { loadDescriptor, saveDescriptor, fileExists } from "../utils/file.js";

export class DescriptorStore {
  constructor(filePath) {
    this.filePath = filePath;
  }

  exists() {
    return fileExists(this.filePath);
  }

  load() {
    return loadDescriptor(this.filePath);
  }

  save(desc) {
    return saveDescriptor(this.filePath, Array.from(desc));
  }
}