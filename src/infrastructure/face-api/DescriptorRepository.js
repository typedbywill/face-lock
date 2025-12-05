import fs from "fs";

export class DescriptorRepository {
    constructor(filePath) {
        this.filePath = filePath;
    }

    exists() {
        return fs.existsSync(this.filePath);
    }

    loadAll() {
        if (!this.exists()) return [];
        try {
            return JSON.parse(fs.readFileSync(this.filePath, "utf8"));
        } catch (e) {
            console.error("Erro ao ler descritores:", e);
            return [];
        }
    }

    saveAll(list) {
        fs.writeFileSync(this.filePath, JSON.stringify(list, null, 2));
    }

    addUser(user) {
        const all = this.loadAll();
        all.push(user);
        this.saveAll(all);
    }

    updateUser(id, descriptor) {
        const all = this.loadAll();
        const user = all.find(u => u.id === id);
        if (!user) return false;

        user.descriptor = descriptor;
        user.updated = new Date().toISOString();

        this.saveAll(all);
        return true;
    }

    removeUser(id) {
        const all = this.loadAll();
        const filtered = all.filter(u => u.id !== id);
        this.saveAll(filtered);
    }

    findUserByName(name) {
        return this.loadAll().find(u => u.name.toLowerCase() === name.toLowerCase());
    }
}
