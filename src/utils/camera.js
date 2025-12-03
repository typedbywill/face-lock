import Webcam from "node-webcam";

export function createCamera(config) {
  return Webcam.create({
    width: config.camera.width,
    height: config.camera.height,
    output: "jpeg",
    callbackReturn: "buffer"
  });
}