// core/FaceMonitor.js
import debug from "../utils/debug.js";

export class FaceMonitor {
  constructor({ camera, recognizer, session, config }) {
    this.camera = camera;
    this.recognizer = recognizer;
    this.session = session;
    this.config = config;
    this.lastSeen = Date.now();
  }

  async start() {
    console.log("Monitorando…");

    while (true) {
      await this.tick();
      await this.sleep(this.config.monitor.checkInterval);
    }
  }

  async tick() {
    if (await this.session.isLocked()) {
      debug("Sistema bloqueado — resetando timer.");
      this.lastSeen = Date.now();
      return;
    }

    let buf;
    try {
      buf = await this.camera.captureBuffer();
    } catch (e) {
      debug("Erro ao capturar câmera:", e);
      return;
    }

    const result = await this.recognizer.recognize(buf);

    if (result.recognized) {
      debug(`Reconhecido: ${result.user.name} (dist=${result.distance})`);
      this.lastSeen = Date.now();
    } else {
      debug(`Não reconhecido (melhor dist=${result.distance})`);
    }

    const elapsed = Date.now() - this.lastSeen;
    const limit = this.config.monitor.delaySeconds * 1000;

    if (elapsed > limit) {
      console.log("Usuário ausente — bloqueando…");
      await this.session.lock();

      // evita loop de bloqueio contínuo
      this.lastSeen = Date.now() + 2000;
    }
  }

  sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
}