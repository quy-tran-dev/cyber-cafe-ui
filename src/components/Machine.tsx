import { useState } from "react";

interface MachineProps {
  id: string;
  name: string;
  zone: string;
}

const actions = ["Power On","Power Off","Download", "Play CSGO", "Play LoL", "Play PUBG"];

export default function Machine({ id, name, zone }: MachineProps) {
  const [status, setStatus] = useState<string>("Idle");

  const handleAction = (action: string) => {
    // sau này sẽ call API NestJS
    console.log(`Machine ${id} in ${zone} do action: ${action}`);
    setStatus(action);
  };

  return (
    <div className="rounded-2xl shadow-md p-4 bg-white flex flex-col gap-2 w-64">
      <h2 className="text-lg font-bold">{name}</h2>
      <p className="text-sm text-gray-500">Zone: {zone}</p>
      <p className="text-sm">Status: <span className="font-semibold">{status}</span></p>

      <div className="grid grid-cols-2 gap-2 mt-2">
        {actions.map((a) => (
          <button
            key={a}
            onClick={() => handleAction(a)}
            className="bg-blue-500 text-white text-sm rounded-lg px-2 py-1 hover:bg-blue-600"
          >
            {a}
          </button>
        ))}
      </div>
    </div>
  );
}
