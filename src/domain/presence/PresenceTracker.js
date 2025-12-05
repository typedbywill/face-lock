export class PresenceTracker {
    constructor() {
        this.lastSeen = Date.now();
    }

    notifyActivity() {
        this.lastSeen = Date.now();
    }

    /**
     * Verifica se o tempo limite foi excedido.
     * @param {number} timeoutMs Tempo limite em millisegundos
     * @returns {boolean}
     */
    isExpired(timeoutMs) {
        const elapsed = Date.now() - this.lastSeen;
        return elapsed > timeoutMs;
    }

    getElapsedTime() {
        return Date.now() - this.lastSeen;
    }
}
