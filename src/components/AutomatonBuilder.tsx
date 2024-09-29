import React, { useState } from 'react';
import { buildNFAFromRegex } from '../utils/BuildNFA';
import AutomatonGraph from './AutomatonGraph';
import { Automaton } from '../utils/Automaton';
import TransitionTable from './TransitionTable';

const App: React.FC = () => {
  const [regex, setRegex] = useState<string>(''); // Expresión regular ingresada por el usuario
  const [automaton, setAutomaton] = useState<Automaton | null>(null);
  const [symbols, setSymbols] = useState<string[]>([]); // Estado para almacenar los símbolos únicos

  const handleBuildNFA = () => {
    const { automaton: nfa, alphabet } = buildNFAFromRegex(regex); // Construir el autómata y obtener el alfabeto
    setAutomaton(nfa); // Actualizar el autómata
    setSymbols(Array.from(alphabet)); // Extraer los símbolos únicos y actualizarlos
  };

  return (
    <div>
      <h1>Automata Finito No Determinista (NFA)</h1>
      <div>
        <input
          type="text"
          value={regex}
          onChange={(e) => setRegex(e.target.value)}
          placeholder="Enter regular expression"
        />
        <button onClick={handleBuildNFA}>Build NFA</button>
      </div>

      {/* Mostrar los símbolos únicos */}
      <h2>Simbolos del alfabeto</h2>
      {symbols.length > 0 && (
        <div>
          <h3>Symbols: {symbols.join(', ')}</h3>
        </div>
      )}

      {/* Renderizar el gráfico del autómata si existe */}
      <h2>Automata</h2>
      {automaton && <AutomatonGraph automaton={automaton} />}

      {/* Renderiza la tabla de transiciones */}
      <h2>Tabla de transiciones</h2>
      {automaton && <TransitionTable automaton={automaton} />}
    </div>
  );
};

export default App;
