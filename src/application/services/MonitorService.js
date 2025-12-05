import debug from "../../utils/debug.js";

export class MonitorService {
    constructor({ camera, detector, locker, tracker, config, historyRepo }) {
        this.camera = camera;
        this.detector = detector;
        this.locker = locker;
        this.tracker = tracker;
        this.config = config;
        this.historyRepo = historyRepo;
        this.running = false;
        this.timer = null;
    }

    async start() {
        console.log("Monitorando…");
        this.running = true;

        while (this.running) {
            try {
                await this.tick();
            } catch (e) {
                console.error("Erro no loop de monitoramento:", e);
            }
            await this.sleep(this.config.monitor.checkInterval);
        }
    }

    stop() {
        this.running = false;
    }

    async tick() {
        // 1. Se já estiver bloqueado, reseta o tempo e não faz nada
        const isLocked = await this.locker.isLocked();
        if (isLocked) {
            debug("Sistema bloqueado — resetando timer.");
            this.tracker.notifyActivity();
            return;
        }

        // 2. Captura imagem
        let buf;
        try {
            buf = await this.camera.capture();
        } catch (e) {
            debug("Erro ao capturar câmera:", e);
            // Se falhar a câmera, consideramos activity pra não bloquear por erro de hardware? 
            // Ou deixamos bloquear? Original code just returned.
            // E não atualizava lastSeen, então se a camera falhar por muito tempo, ele bloqueia.
            return;
        }

        // 3. Detecta
        const result = await this.detector.detect(buf);

        if (result.isMatch) {
            debug(`Reconhecido: ${result.user.name} (dist=${result.distance})`);
            this.tracker.notifyActivity();
        } else {
            debug(`Não reconhecido (match=${result.detected ? "sim" : "não"}, dist=${result.distance})`);
        }

        // 4. Verifica tempo
        const limit = this.config.monitor.delaySeconds * 1000;
        if (this.tracker.isExpired(limit)) {
            console.log("Usuário ausente — bloqueando…");
            await this.locker.lock();
            if (this.historyRepo) {
                this.historyRepo.addEvent('presence_timeout');
            }

            // Evita loop (bloqueia e logo em seguida detecta que bloqueou)
            // Dando um tempo extra de "activity" fake
            this.tracker.notifyActivity();
            // Original code added 2000ms to lastSeen, effectively resetting it purely.
        }
    }

    sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }
}
