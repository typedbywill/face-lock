import { NodeWebcamAdapter } from "../infrastructure/camera/NodeWebcamAdapter.js";
import { ModelLoader } from "../infrastructure/face-api/ModelLoader.js";
import { DescriptorRepository } from "../infrastructure/face-api/DescriptorRepository.js";
import { getFaceDescriptor } from "../infrastructure/face-api/face-utils.js";
import config from "../config/ConfigLoader.js";

async function main() {
  const name = process.argv[2];
  if (!name) {
    console.log("Uso: npm run face:update -- <nome>");
    return;
  }

  const store = new DescriptorRepository(config.descriptorFile);
  const user = store.findUserByName(name);

  if (!user) {
    console.log("Usuário não encontrado. Use o comando 'face:add' para criar um novo.");
    return;
  }

  const model = new ModelLoader(config.modelPath);
  await model.loadOnce();

  console.log("Capturando novo rosto para:", name);

  const camera = new NodeWebcamAdapter(config.camera);
  const buffer = await camera.capture();
  const descriptor = await getFaceDescriptor(buffer);

  if (!descriptor) {
    console.log("Nenhum rosto detectado.");
    return;
  }

  store.updateUser(user.id, Array.from(descriptor));
  console.log("Rosto atualizado com sucesso!");
}

main();