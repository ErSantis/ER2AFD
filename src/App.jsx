import "./App.css";
import AutomataBuilder from "./components/AutomatonBuilder";
import { AutomatonProvider } from "./components/AutomatonContext"; // Importa el proveedor del contexto

function App() {
  return (
    <div className="App">
      <AutomatonProvider>
        <AutomataBuilder />
      </AutomatonProvider>
    </div>
  );
}

export default App;
