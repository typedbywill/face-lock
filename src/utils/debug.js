import config from "../../config/default.json" with { type: "json" };

export default function debug(...msg) {
  if (config.debugMode) console.log("[DEBUG]", ...msg);
}