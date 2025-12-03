// core/FaceRecognizer.js
import { getFaceDescriptor, euclidean } from "../utils/face.js";
import debug from "../utils/debug.js";

export class FaceRecognizer {
  constructor(baseDescriptor, threshold) {
    this.base = baseDescriptor;
    this.threshold = threshold;
  }

  async recognize(buffer) {
    const desc = await getFaceDescriptor(buffer);
    if (!desc) {
      debug("Nenhum rosto detectado");
      return false;
    }

    const dist = euclidean(desc, this.base);
    debug("Distância:", dist);

    return dist < this.threshold;
  }
}