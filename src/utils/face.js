import * as faceapi from "@vladmandic/face-api";
import canvas from "canvas";

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

export async function loadModels(modelPath) {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
}

export async function getFaceDescriptor(buffer) {
  const img = await canvas.loadImage(buffer);
  const det = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();

  return det ? det.descriptor : null;
}

export function euclidean(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) {
    s += (a[i] - b[i]) ** 2;
  }
  return Math.sqrt(s);
}