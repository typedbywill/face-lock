// src/cli/clearAll.js
import fs from "fs";
import config from "../../config/default.json" with { type: "json" };

fs.writeFileSync(config.descriptorFile, "[]");
console.log("Todos os rostos foram removidos.");