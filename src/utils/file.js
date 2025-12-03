import fs from "fs";

export function saveDescriptor(path, descriptor) {
  fs.writeFileSync(path, JSON.stringify({ descriptor }));
}

export function loadDescriptor(path) {
  const raw = fs.readFileSync(path);
  return JSON.parse(raw).descriptor;
}

export function fileExists(path) {
  return fs.existsSync(path);
}