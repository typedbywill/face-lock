import { NodeWebcamAdapter } from "../infrastructure/camera/NodeWebcamAdapter.js";
import { ModelLoader } from "../infrastructure/face-api/ModelLoader.js";
import { DescriptorRepository } from "../infrastructure/face-api/DescriptorRepository.js";
import { getFaceDescriptor } from "../infrastructure/face-api/face-utils.js";
import config from "../config/ConfigLoader.js";
import crypto from "crypto";

async function main() {
  const name = process.argv[2];
  if (!name) {
    console.log("Uso: npm run face:add -- <nome>");
    return;
  }

  const model = new ModelLoader(config.modelPath);
  await model.loadOnce();

  const store = new DescriptorRepository(config.descriptorFile);

  console.log("Capturando rosto para:", name);

  const camera = new NodeWebcamAdapter(config.camera);
  const buffer = await camera.capture();
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