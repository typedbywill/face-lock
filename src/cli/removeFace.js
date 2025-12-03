// src/cli/removeFace.js
import { DescriptorStore } from "../services/DescriptorStore.js";
import config from "../../config/default.json" with { type: "json" };

const name = process.argv[2];
if (!name) {
  console.log("Uso: npm run face:remove -- <nome>");
  process.exit(1);
}

const store = new DescriptorStore(config.descriptorFile);
const user = store.findUserByName(name);

if (!user) {
  console.log("Usuário não encontrado.");
  process.exit(1);
}

store.removeUser(user.id);
console.log("Usuário removido:", name);