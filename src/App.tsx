import MachineList from "./components/MachineList";

function App() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold p-4">Cyber Cafe Simulation</h1>
      <MachineList />
    </div>
  );
}

export default App;
