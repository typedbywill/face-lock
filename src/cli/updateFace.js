import { Camera } from "../services/Camera.js";
import { ModelLoader } from "../services/ModelLoader.js";
import { DescriptorStore } from "../services/DescriptorStore.js";
import { getFaceDescriptor } from "../utils/face.js";
import config from "../../config/default.json" with { type: "json" };
import cameraLib from "../utils/camera.js";

async function main() {
  const name = process.argv[2];
  if (!name) {
    console.log("Uso: npm run face:update -- <nome>");
    return;
  }

  const store = new DescriptorStore(config.descriptorFile);
  const user = store.findUserByName(name);

  if (!user) {
    console.log("Usuário não encontrado.");
    return;
  }

  const model = new ModelLoader(config.modelPath);
  await model.loadOnce();

  const camera = new Camera(config, cameraLib);
  console.log("Atualizando rosto de:", name);

  const buffer = await camera.captureBuffer();
  const desc = await getFaceDescriptor(buffer);

  if (!desc) {
    console.log("Nenhum rosto detectado.");
    return;
  }

  store.updateUser(user.id, Array.from(desc));
  console.log("Rosto atualizado com sucesso!");
}

main();