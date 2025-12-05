import fs from "fs";
import path from 'path';

export class DescriptorRepository {
    constructor(filePath, imagesDir) {
        this.filePath = filePath;
        this.imagesDir = imagesDir || path.dirname(filePath);

        if (!fs.existsSync(this.imagesDir)) {
            try { fs.mkdirSync(this.imagesDir, { recursive: true }); } catch (e) { }
        }
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

    saveAvatar(id, buffer) {
        try {
            const p = path.join(this.imagesDir, `${id}.jpg`);
            fs.writeFileSync(p, buffer);
            return p;
        } catch (e) {
            console.error("Erro ao salvar avatar:", e);
            return null;
        }
    }

    deleteAvatar(id) {
        try {
            const p = path.join(this.imagesDir, `${id}.jpg`);
            if (fs.existsSync(p)) {
                fs.unlinkSync(p);
            }
        } catch (e) {
            console.error("Erro ao deletar avatar:", e);
        }
    }

    getAvatarBase64(id) {
        try {
            const p = path.join(this.imagesDir, `${id}.jpg`);
            if (fs.existsSync(p)) {
                return "data:image/jpeg;base64," + fs.readFileSync(p, 'base64');
            }
        } catch (e) {
            console.error("Erro ao ler avatar:", e);
        }
        return null; // ou uma imagem default?
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
