import Webcam from "node-webcam";

export class CameraLib {
  static createCamera(config) {
    return Webcam.create({
      width: config.camera.width,
      height: config.camera.height,
      output: "jpeg",
      callbackReturn: "buffer"
    });
  }
}