import fs from "fs";
import config from "../config/default.json" with { type: "json" };
import { createCamera } from "./utils/camera.js";
import { loadModels, getFaceDescriptor } from "./utils/face.js";
import { saveDescriptor } from "./utils/file.js";

const camera = createCamera(config);

async function main() {
  console.log("Carregando modelos...");
  await loadModels(config.modelPath);

  console.log("Posicione-se em frente à câmera...");
  await new Promise(r => setTimeout(r, 2000));

  camera.capture("cache/user", async (err, buffer) => {
    if (err) return console.error("Erro ao capturar:", err);

    const descriptor = await getFaceDescriptor(buffer);

    if (!descriptor) {
      console.log("Nenhum rosto detectado.");
      return;
    }

    saveDescriptor(config.descriptorFile, Array.from(descriptor));
    console.log("Rosto salvo em", config.descriptorFile);
  });
}

main();