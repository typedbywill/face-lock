import { DescriptorRepository } from "../infrastructure/face-api/DescriptorRepository.js";
import config from "../config/ConfigLoader.js";

const store = new DescriptorRepository(config.descriptorFile);
store.saveAll([]);
console.log("Todos os usuários foram removidos.");