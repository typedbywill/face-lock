import { Camera } from "../services/Camera.js";
import { ModelLoader } from "../services/ModelLoader.js";
import { DescriptorStore } from "../services/DescriptorStore.js";
import { getFaceDescriptor } from "../utils/face.js";
import config from "../../config/default.json" with { type: "json" };
import { CameraLib } from "../utils/camera.js";
import crypto from "crypto";

async function main() {
  const name = process.argv[2];
  if (!name) {
    console.log("Uso: npm run face:add -- <nome>");
    return;
  }

  const model = new ModelLoader(config.modelPath);
  await model.loadOnce();

  const store = new DescriptorStore(config.descriptorFile);

  console.log("Capturando rosto para:", name);

  const camera = new Camera(config, CameraLib);
  const buffer = await camera.captureBuffer();
  const descriptor = await getFaceDescriptor(buffer);

  if (!descriptor) {
    console.log("Nenhum rosto detectado.");
    return;
  }

  const user = {
    id: crypto.randomUUID(),
    name,
    descriptor: Array.from(descriptor),
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  };

  store.addUser(user);

  console.log("Rosto de", name, "adicionado com sucesso!");
}

main();