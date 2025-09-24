import MachineList from "./components/MachineList";

function App() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      {/* Title */}
      <h1 className="text-2xl font-bold p-4">Cyber Cafe Simulation</h1>
      {/* Main (Machine Data List) */}
      <MachineList />
    </div>
  );
}

export default App;
