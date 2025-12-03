// core/FaceRecognizer.js
import { getFaceDescriptor, euclidean } from "../utils/face.js";
import debug from "../utils/debug.js";

export class FaceRecognizer {
  /**
   * @param {Array<{id: string, name: string, descriptor: number[]}>} users
   * @param {number} threshold
   */
  constructor(users, threshold) {
    this.users = users;
    this.threshold = threshold;
  }

  /**
   * Retorna:
   *  { recognized: true/false, user: {...}, distance }
   */
  async recognize(buffer) {
    const desc = await getFaceDescriptor(buffer);

    if (!desc) {
      debug("Nenhum rosto detectado");
      return { recognized: false, user: null, distance: null };
    }

    let bestUser = null;
    let bestDist = Infinity;

    for (const user of this.users) {
      const dist = euclidean(desc, user.descriptor);

      debug(`Distância para ${user.name}:`, dist);

      if (dist < bestDist) {
        bestDist = dist;
        bestUser = user;
      }
    }

    const recognized = bestDist < this.threshold;

    if (recognized) {
      debug(`Usuário reconhecido: ${bestUser.name} (dist ${bestDist})`);
    } else {
      debug(`Nenhum usuário compatível. Melhor dist: ${bestDist}`);
    }

    return {
      recognized,
      user: recognized ? bestUser : null,
      distance: bestDist
    };
  }
}