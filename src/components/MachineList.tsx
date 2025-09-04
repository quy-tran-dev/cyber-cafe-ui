import Machine from "./Machine";

const zones = ["Zone A", "Zone B", "Zone C", "Zone D"];

export default function MachineList() {
  // sau này lấy list từ API NestJS Seeder
  const machines = zones.flatMap((zone, z) =>
    Array.from({ length: 3 }).map((_, i) => ({
      id: `${zone}-${i + 1}`,
      name: `Machine ${z * 3 + i + 1}`,
      zone,
    }))
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {machines.map((m) => (
        <Machine key={m.id} {...m} />
      ))}
    </div>
  );
}
