import React, { useState, useEffect } from "react";
import { getMachines } from "../configs/api";
import Machine from "./Machine";
import type { IMachine } from "../interfaces/machine.interface";

export default function MachineList() {
  const [machines, setMachines] = useState<IMachine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMachines = async () => {
    try {
      const data = await getMachines();
      setMachines(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInitialMachine = () => {
    fetch("http://localhost:3000/seeder/machines")
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to initialize machines");
        }
        return response.text();
      })
      .then((message) => {
        console.log("API response:", message);
        setError(null);
        fetchMachines(); // 👈 gọi lại fetch sau khi khởi tạo thành công
      })
      .catch((err) => {
        console.error("Error initializing machines:", err);
        setError(err.message);
      });
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center text-lg">Đang tải danh sách máy...</div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 sm:grid-cols-4 gap-4 p-4">
      {machines.length > 0 ? (
        machines.map((m) => (
          // Dùng hostname làm key nếu nó là duy nhất
          <Machine key={m.hostname} {...m} />
        ))
      ) : (
        <div className="col-span-full text-center text-gray-500">
          Không có máy nào được tìm thấy.
          <div className="text-center mt-2">
            <button
              onClick={handleInitialMachine}
              className="border-1 border-black p-2 rounded-md w-[200px] text-black font-bold cursor-pointer hover:opacity-70"
            >
              Khởi tạo máy tính
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
