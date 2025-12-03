// services/Camera.js
export class Camera {

  constructor(config, cameraLib) {
    this.config = config;
    this.camera = cameraLib.createCamera(config);
  }

  async captureBuffer() {
    return new Promise((resolve, reject) => {
      this.camera.capture("cache/tmp", (err, buffer) => {
        if (err) return reject(err);
        resolve(buffer);
      });
    });
  }
}