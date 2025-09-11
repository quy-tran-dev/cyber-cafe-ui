import React, { useState, useEffect } from "react";
import { getMachines } from "../configs/api";
import Machine from "./Machine";
import type { IMachine } from "../interfaces/machine.interface";

export default function MachineList() {
  const [machines, setMachines] = useState<IMachine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const data = await getMachines(); // Sử dụng hàm getMachines
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
    fetchMachines();
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-lg">Đang tải danh sách máy...</div>;
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
        </div>
      )}
    </div>
  );
}