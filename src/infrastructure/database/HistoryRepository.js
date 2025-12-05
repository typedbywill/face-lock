export class HistoryRepository {
    constructor(db) {
        this.db = db;
    }

    addEvent(trigger) {
        const stmt = this.db.prepare('INSERT INTO lock_history (trigger) VALUES (?)');
        stmt.run(trigger);
    }

    getRecent(limit = 10) {
        const stmt = this.db.prepare('SELECT * FROM lock_history ORDER BY timestamp DESC LIMIT ?');
        return stmt.all(limit);
    }
}
