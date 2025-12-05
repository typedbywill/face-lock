import Database from 'better-sqlite3';
import path from 'path';

class DatabaseConnection {
    constructor() {
        this.db = null;
    }

    getInstance(dbPath) {
        if (!this.db) {
            const isDev = process.env.NODE_ENV === 'development';
            // Se não passado dbPath, usa um padrão (útil para testes ou default)
            const finalPath = dbPath || (isDev ? './autolock.db' : path.join(process.resourcesPath, 'autolock.db'));

            this.db = new Database(finalPath, { verbose: isDev ? console.log : null });
            this.initSchema();
        }
        return this.db;
    }

    initSchema() {
        const schema = `
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );

      CREATE TABLE IF NOT EXISTS lock_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        trigger TEXT
      );
    `;
        this.db.exec(schema);
    }
}

export const dbConnection = new DatabaseConnection();
