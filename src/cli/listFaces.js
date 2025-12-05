import { DescriptorRepository } from "../infrastructure/face-api/DescriptorRepository.js";
import config from "../config/ConfigLoader.js";

const store = new DescriptorRepository(config.descriptorFile);
const users = store.loadAll();

if (users.length === 0) {
  console.log("Nenhum usuário cadastrado.");
} else {
  console.log("Usuários cadastrados:");
  users.forEach(u => console.log(`- ${u.name} (ID: ${u.id})`));
}