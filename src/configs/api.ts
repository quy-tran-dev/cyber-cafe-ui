const API_URL = "http://localhost:3000";

export async function getMachines() {
  const res = await fetch(`${API_URL}/machines`);
  return res.json();
}

export async function startMachine(id: string) {
  return fetch(`${API_URL}/machines/${id}/start`, { method: "POST" });
}

export async function stopMachine(id: string) {
  return fetch(`${API_URL}/machines/${id}/stop`, { method: "POST" });
}

export async function playGame(id: string, game: string) {
  return fetch(`${API_URL}/machines/${id}/play/${game}`, { method: "POST" });
}

export async function downloadFile(id: string, file: string) {
  return fetch(`${API_URL}/machines/${id}/download`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file }),
  });
}
