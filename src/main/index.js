import config from "../config/ConfigLoader.js";
import { NodeWebcamAdapter } from "../infrastructure/camera/NodeWebcamAdapter.js";
import { DescriptorRepository } from "../infrastructure/face-api/DescriptorRepository.js";
import { ModelLoader } from "../infrastructure/face-api/ModelLoader.js";
import { FaceApiDetector } from "../infrastructure/face-api/FaceApiDetector.js";
import { SystemLockFactory } from "../infrastructure/system/SystemLockFactory.js";
import { PresenceTracker } from "../domain/presence/PresenceTracker.js";
import { MonitorService } from "../application/services/MonitorService.js";

async function main() {
    console.log("Iniciando Auto-Lock v2 (Modular)...");

    // 1. Setup Infrastructure
    const repository = new DescriptorRepository(config.descriptorFile);

    if (!repository.exists()) {
        console.error("Nenhum rosto cadastrado. Execute: npm run capture");
        process.exit(1);
    }

    const modelLoader = new ModelLoader(config.modelPath);
    const detector = new FaceApiDetector(repository, modelLoader, config.monitor.threshold);

    console.log("Carregando modelos IA...");
    await detector.init(); // Carrega modelos

    const camera = new NodeWebcamAdapter(config.camera);
    const locker = SystemLockFactory.create(config);

    // 2. Setup Domain
    const tracker = new PresenceTracker();

    // 3. Setup Application
    const service = new MonitorService({
        camera,
        detector,
        locker,
        tracker,
        config
    });

    // 4. Start
    service.start();
}

main().catch(err => {
    console.error("Falha fatal:", err);
    process.exit(1);
});
