export interface IMachine {
  hostname: string;
  os: string;
  location: string;
  user_id?: string;
  status: "active" | "inactive" | "maintenance";
}

export interface IMachineUpdateStatusPayload {
  status: "active" | "inactive" | "maintenance";
  user_id?: string;
}

export interface IMachineUpdateModePayload {
  mode:
    | "normal"
    | "network_lag"
    | "machine_lag"
    | "multi_task"
    | "high_graphics"
    | "crash";
  user_id?: string;
}
