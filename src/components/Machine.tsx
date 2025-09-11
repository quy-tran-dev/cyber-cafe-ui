import { useState, useEffect } from "react";
import type { IMachine } from "../interfaces/machine.interface";
import { updateMachineMode, updateMachineStatus } from "../configs/api";

interface Action {
  name: string;
  action:
  | "normal"
  | "network_lag"
  | "machine_lag"
  | "multi_task"
  | "high_graphics"
  | "crash";
}

const actions: Action[] = [
  { name: "Bình thường", action: "normal" },
  { name: "Mạng lag", action: "network_lag" },
  { name: "Máy lag", action: "machine_lag" },
  { name: "Chơi game", action: "multi_task" },
  { name: "Chơi game nặng", action: "high_graphics" },
  { name: "Sập máy", action: "crash" },
];

interface MachineStatus {
  name: string;
  action: "active" | "inactive" | "maintenance";
}

const MachineStatus: MachineStatus[] = [
  { name: "Bật", action: "active" },
  { name: "Tắt", action: "inactive" },
  { name: "Bảo trì", action: "maintenance" },
];

export default function Machine({ hostname, location, os, user_id, status }: IMachine) {
  const [action, setAction] = useState<Action | undefined>();
  const [statusAction, setStatusAction] = useState({
    name: "Tắt",
    action: "inactive",
  });

  const [user, setUser] = useState<string | undefined>(undefined);
  const [isEditingUser, setIsEditingUser] = useState<boolean>(false);

  const [lastActionTime, setLastActionTime] = useState(0);
  const [canPerformAction, setCanPerformAction] = useState(true);
  const cooldownPeriodAction = 2000;

  const [lastStatusTime, setLastStatusTime] = useState(0);
  const [canPerformStatus, setCanPerformStatus] = useState(true);
  const cooldownPeriodStatus = 2000;
  useEffect(() => {
    if (user_id && status === "active") {
      setUser(user_id);
    }
    if (status !== "inactive") {
      setStatusAction({ name: "Bật", action: "active" });
      setAction({ name: "Bình thường", action: "normal" },);
    }

  }, []);
  useEffect(() => {
    if (lastActionTime === 0) return;

    const now = Date.now();
    const timeElapsed = now - lastActionTime;

    if (timeElapsed < cooldownPeriodAction) {
      setCanPerformAction(false);
      const remainingTime = cooldownPeriodAction - timeElapsed;
      const timer = setTimeout(() => {
        setCanPerformAction(true);
      }, remainingTime);
      return () => clearTimeout(timer);
    } else {
      setCanPerformAction(true);
    }
  }, [lastActionTime]);

  useEffect(() => {
    if (lastStatusTime === 0) return;

    const now = Date.now();
    const timeElapsed = now - lastStatusTime;

    if (timeElapsed < cooldownPeriodStatus) {
      setCanPerformStatus(false);
      const remainingTime = cooldownPeriodStatus - timeElapsed;
      const timer = setTimeout(() => {
        setCanPerformStatus(true);
      }, remainingTime);
      return () => clearTimeout(timer);
    } else {
      setCanPerformStatus(true);
    }
  }, [lastStatusTime]);

  const handleStatus = async (a: MachineStatus, id: string) => {
    if (!canPerformStatus) {
      const remaining = ((lastStatusTime + cooldownPeriodStatus - Date.now()) / 1000).toFixed(1);
      console.log(`Vui lòng chờ ${remaining} giây trước khi thực hiện hành động khác.`);
      return;
    }
    console.log(`Thực hiện hành động ${a.name} cho máy ${id}`);


    try {
      console.log(`Đang thực hiện hành động ${a.name} cho máy ${hostname}...`);
      await updateMachineStatus(hostname, { status: a.action, user_id: user });
      console.log(`Thành công: Cập nhật trạng thái máy ${hostname} thành ${a.name}`);

      setStatusAction(a);
      setLastStatusTime(Date.now());

      if (a.action === "active") {
        handleAction(
          { name: "Bình thường", action: "normal" },
          hostname
        );
      } else {
        setAction(undefined);
      }

    } catch (error) {
      console.error(`Lỗi khi cập nhật trạng thái máy ${hostname}:`, error);
    }
  };

  const handleAction = async (a: Action, id: string) => {
    if (!canPerformAction) {
      const remaining = ((lastActionTime + cooldownPeriodAction - Date.now()) / 1000).toFixed(1);
      console.log(`Vui lòng chờ ${remaining} giây trước khi thực hiện hành động khác.`);
      return;
    }
    console.log(`Thực hiện hành động ${a.name} cho máy ${id}`);


    try {
      console.log(`Đang thực hiện hành động ${a.name} cho máy ${hostname}...`);
      await updateMachineMode(hostname, { mode: a.action, user_id: user });
      console.log(`Thành công: Cập nhật chế độ máy ${hostname} thành ${a.name}`);

      setAction(a);
      setLastActionTime(Date.now());

      if (a.action === "crash") {
        handleStatus(
          { name: "Tắt", action: "inactive" },
          hostname
        );
      }

    } catch (error) {
      console.error(`Lỗi khi cập nhật chế độ máy ${hostname}:`, error);
    }

  };



  return (
    <div className="rounded-2xl shadow-md p-4 bg-white flex flex-col gap-2 w-64">
      <h2 className="text-lg font-bold">Máy: {hostname} - {os}</h2>
      <p className="text-sm text-gray-500">Khu vực máy: {location}</p>
      {user ? (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">User: {user}</span>
          <button
            onClick={() => setIsEditingUser(true)}
            className="text-blue-500 text-xs hover:underline"
          >
            (Thay đổi)
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditingUser(true)}
          className="bg-blue-500 text-white text-sm rounded-lg px-3 py-1 hover:bg-blue-600"
        >
          Thêm User
        </button>
      )}

      {isEditingUser && (
        <div className="mt-2 flex gap-2 items-center">
          <input
            type="text"
            placeholder="Nhập tên user..."
            className="p-2 border rounded-md text-sm w-full"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const input = e.target as HTMLInputElement;
                if (input.value.trim()) {
                  setUser(input.value.trim());
                  setIsEditingUser(false);
                }
              }
            }}
          />
          <button
            onClick={() => setIsEditingUser(false)}
            className="text-red-500 text-sm hover:underline"
          >
            Hủy
          </button>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {MachineStatus.map((a, i) => {
          const isActive = statusAction.action === a.action;
          const isCooldown = !canPerformStatus;

          let buttonClasses = "text-white text-sm rounded-lg px-2 py-1";

          if (isActive) {
            buttonClasses += " bg-green-500 hover:bg-green-600";
          } else if (isCooldown) {
            buttonClasses += " bg-gray-400 cursor-not-allowed";
          } else {
            buttonClasses += " bg-blue-500 hover:bg-blue-600";
          }

          return (
            <button
              key={i}
              onClick={() => handleStatus(a, hostname)}
              className={buttonClasses}
              disabled={isCooldown}
            >
              {a.name}
            </button>
          );
        })}
      </div>
      <p className="text-sm">
        Tình trạng giả lập: <span className="font-semibold">{action?.name ? action.name : statusAction.name}</span>
      </p>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {actions.map((a, i) => {
          let isCooldown = !canPerformAction;
          let isActive = action && action.action === a.action;

          if (statusAction.action !== "active") {
            isCooldown = true;
            isActive = false;
          }


          let buttonClasses = "text-white text-sm rounded-lg px-2 py-1";

          if (isActive) {
            buttonClasses += " bg-green-500 hover:bg-green-600";
          } else if (isCooldown) {
            buttonClasses += " bg-gray-400 cursor-not-allowed";
          } else {
            buttonClasses += " bg-blue-500 hover:bg-blue-600";
          }

          return (
            <button
              key={i}
              onClick={() => handleAction(a, hostname)}
              className={buttonClasses}
              disabled={isCooldown}
            >
              {a.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}