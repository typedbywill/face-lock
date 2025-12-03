import config from "../../config/default.json" with { type: "json" };

export default function debug(...msg) {
  if (!config.debugMode) return;

  const now = new Date();
  const timestamp = now.toLocaleTimeString("pt-BR", { hour12: false }) +
    "." +
    now.getMilliseconds().toString().padStart(3, "0");

  console.log(`[DEBUG ${timestamp}]`, ...msg);
}