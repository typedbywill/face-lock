// src/cli/listFaces.js
import { DescriptorStore } from "../services/DescriptorStore.js";
import config from "../../config/default.json" with { type: "json" };

const store = new DescriptorStore(config.descriptorFile);
const list = store.loadAll();

if (!list.length) {
  console.log("Nenhum rosto cadastrado.");
  process.exit(0);
}

console.table(
  list.map(u => ({ id: u.id, name: u.name, created: u.created, updated: u.updated }))
);