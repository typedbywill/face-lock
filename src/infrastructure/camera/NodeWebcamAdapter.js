import Webcam from "node-webcam";

export class NodeWebcamAdapter {
    constructor(cameraConfig) {
        this.config = cameraConfig;
        this.camera = Webcam.create({
            width: cameraConfig.width,
            height: cameraConfig.height,
            output: "jpeg",
            callbackReturn: "buffer",
            // Adicionais opções comuns de webcam podem ser adicionadas aqui se necessário
            device: false,
            verbose: false
        });
    }

    async capture() {
        return new Promise((resolve, reject) => {
            this.camera.capture("cache/capture", (err, buffer) => {
                if (err) return reject(err);
                resolve(buffer);
            });
        });
    }
}
