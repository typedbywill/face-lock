import { getFaceDescriptor, euclidean } from "./face-utils.js";
import debug from "../../utils/debug.js";
// Note: debug.js ainda está em src/utils, vamos movê-lo ou mantê-lo? 
// Por enquanto vou assumir que utils globais ficam em src/utils ou src/shared.
// Mas o ideal seria injetar logger.

export class FaceApiDetector {
    /**
     * @param {DescriptorRepository} repository
     * @param {ModelLoader} modelLoader
     * @param {number} threshold
     */
    constructor(repository, modelLoader, threshold = 0.6) {
        this.repository = repository;
        this.modelLoader = modelLoader;
        this.threshold = threshold;
    }

    async init() {
        await this.modelLoader.loadOnce();
    }

    /**
     * Detecta se há uma pessoa conhecida na imagem.
     * @param {Buffer} imageBuffer 
     * @returns {Promise<{detected: boolean, user: ?Object, distance: ?number}>}
     */
    async detect(imageBuffer) {
        const desc = await getFaceDescriptor(imageBuffer);

        if (!desc) {
            return { detected: false, user: null, distance: null };
        }

        const users = this.repository.loadAll();
        let bestUser = null;
        let bestDist = Infinity;

        for (const user of users) {
            const dist = euclidean(desc, user.descriptor);
            if (dist < bestDist) {
                bestDist = dist;
                bestUser = user;
            }
        }

        const isMatch = bestDist < this.threshold;

        return {
            detected: true, // Rosto detectado, mas pode ser desconhecido
            isMatch,        // Rosto conhecido?
            user: isMatch ? bestUser : null,
            distance: bestDist
        };
    }

    setThreshold(newThreshold) {
        this.threshold = newThreshold;
    }

    async reload() {
        console.log("Recarregando modelos de reconhecimento...");
        await this.init();
    }
}
