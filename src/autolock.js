import config from "../config/default.json" with { type: "json" };
import { createCamera } from "./utils/camera.js";
import debug from "./utils/debug.js";
import { loadModels, getFaceDescriptor, euclidean } from "./utils/face.js";
import { loadDescriptor, fileExists } from "./utils/file.js";
import { isLocked, lockSession } from "./utils/system.js";
import fs from "fs";

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
      debug("Sistema está bloqueado — reiniciando timer.");
      lastSeen = Date.now();
      return;
    }

    camera.capture("cache/tmp", async (err, buffer) => {
      if (err) {
        debug("Erro de captura:", err);
        return;
      }

      if (config.debugMode) {
        fs.writeFileSync("cache/debug_frame.jpg", buffer);
        debug("Frame salvo: cache/debug_frame.jpg");
      }

      const det = await getFaceDescriptor(buffer);

      if (!det) {
        debug("🙅 Nenhum rosto detectado.");
      } else {
        const d = euclidean(det, base);
        debug("Distância calculada:", d);

        if (d < config.monitor.threshold) {
          debug("✅ Rosto reconhecido — resetando timer.");
          lastSeen = Date.now();
        } else {
          debug("❌ Rosto não reconhecido (dist > threshold).");
        }
      }

      if (Date.now() - lastSeen > config.monitor.delaySeconds * 1000) {
        console.log("Usuário ausente — bloqueando…");
        debug("Tempo excedido:", Date.now() - lastSeen);
        lockSession();
        lastSeen = Date.now() + 2000;
      }

    });

  }, config.monitor.checkInterval);
}

main();