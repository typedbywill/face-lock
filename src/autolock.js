// main.js
import config from "../config/default.json" with { type: "json" };
import { Camera } from "./services/Camera.js";
import { ModelLoader } from "./services/ModelLoader.js";
import { DescriptorStore } from "./services/DescriptorStore.js";
import { FaceRecognizer } from "./core/FaceRecognizer.js";
import { FaceMonitor } from "./core/FaceMonitor.js";
import { SessionController } from "./core/SessionController.js";
import { CameraLib } from "./utils/camera.js";

async function main() {
  const store = new DescriptorStore(config.descriptorFile);

  if (!store.exists()) {
    console.log("Nenhum rosto cadastrado. Execute: npm run capture");
    return;
  }

  const baseDescriptor = store.load();

  const modelLoader = new ModelLoader(config.modelPath);
  await modelLoader.loadOnce();

  const camera = new Camera(config, CameraLib);
  const recognizer = new FaceRecognizer(baseDescriptor, config.monitor.threshold);
  const session = new SessionController();

  const monitor = new FaceMonitor({
    camera,
    recognizer,
    session,
    config
  });

  monitor.start();
}

main();