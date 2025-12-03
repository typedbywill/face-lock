import config from "../config/default.json" with { type: "json" };
import { createCamera } from "./utils/camera.js";
import { loadModels, getFaceDescriptor, euclidean } from "./utils/face.js";
import { loadDescriptor, fileExists } from "./utils/file.js";
import { isLocked, lockSession } from "./utils/system.js";

const camera = createCamera(config);

async function main() {
  if (!fileExists(config.descriptorFile)) {
    console.log("Nenhum rosto cadastrado. Execute: npm run capture");
    return;
  }

  const base = loadDescriptor(config.descriptorFile);

  console.log("Carregando modelos...");
  await loadModels(config.modelPath);
  console.log("Monitorando...");

  let lastSeen = Date.now();

  setInterval(async () => {
    if (await isLocked()) {
      lastSeen = Date.now();
      return;
    }

    camera.capture("cache/tmp", async (err, buffer) => {
      if (err) return;

      const det = await getFaceDescriptor(buffer);

      if (det) {
        const d = euclidean(det, base);
        if (d < config.monitor.threshold) {
          lastSeen = Date.now();
        }
      }

      if (Date.now() - lastSeen > config.monitor.delaySeconds * 1000) {
        console.log("Usuário ausente — bloqueando…");
        lockSession();
        lastSeen = Date.now() + 2000;
      }
    });
  }, config.monitor.checkInterval);
}

main();