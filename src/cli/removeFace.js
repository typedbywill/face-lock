import { DescriptorRepository } from "../infrastructure/face-api/DescriptorRepository.js";
import config from "../config/ConfigLoader.js";

const nameOrId = process.argv[2];

if (!nameOrId) {
  console.log("Uso: npm run face:remove -- <nome_ou_id>");
  process.exit(1);
}

const store = new DescriptorRepository(config.descriptorFile);
const all = store.loadAll();

const target = all.find(u => u.id === nameOrId || u.name === nameOrId);

if (!target) {
  console.log("Usuário não encontrado.");
} else {
  store.removeUser(target.id);
  console.log(`Usuário ${target.name} removido.`);
}