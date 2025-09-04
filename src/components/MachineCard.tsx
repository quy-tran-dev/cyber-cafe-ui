import React from "react";

type MachineProps = {
  id: number;
  name: string;
  status: "online" | "offline" | "playing";
  onAction: (id: number, action: string) => void;
};

const MachineCard: React.FC<MachineProps> = ({ id, name, status, onAction }) => {
  return (
    <div className="rounded-2xl shadow-lg p-4 bg-white flex flex-col gap-2">
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="text-sm text-gray-500">Trạng thái: {status}</p>
      <div className="flex gap-2">
        <button 
          className="px-3 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600"
          onClick={() => onAction(id, "power")}
        >
          Bật/Tắt
        </button>
        <button 
          className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          onClick={() => onAction(id, "download")}
        >
          Download
        </button>
        <button 
          className="px-3 py-1 rounded-lg bg-purple-500 text-white hover:bg-purple-600"
          onClick={() => onAction(id, "csgo")}
        >
          CSGO
        </button>
        <button 
          className="px-3 py-1 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
          onClick={() => onAction(id, "lol")}
        >
          LoL
        </button>
      </div>
    </div>
  );
};

export default MachineCard;
