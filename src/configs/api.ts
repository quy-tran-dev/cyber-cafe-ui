import type {
  IMachine,
  IMachineUpdateStatusPayload,
  IMachineUpdateModePayload,
} from "../interfaces/machine.interface";

const API_URL = "http://localhost:3000";

export async function getMachines(): Promise<IMachine[]> {
  const res = await fetch(`${API_URL}/machines`);
  if (!res.ok) {
    throw new Error(`Failed to fetch machines: ${res.status}`);
  }
  return res.json() as Promise<IMachine[]>;
}

export async function updateMachineStatus(
  hostname: string,
  payload: IMachineUpdateStatusPayload
): Promise<void> {
  const res = await fetch(`${API_URL}/machines/${hostname}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to update machine status: ${res.status}`);
  }
  return;
}

export async function updateMachineMode(
  hostname: string,
  payload: IMachineUpdateModePayload
): Promise<void> {
  const res = await fetch(`${API_URL}/machines/${hostname}/mode`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to change machine mode: ${res.status}`);
  }
  return;
}
