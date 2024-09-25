import React, { useState } from 'react';
import { buildNFAFromRegex } from '../utils/BuildNFA';
import AutomatonGraph from './AutomatonGraph';
import { Automaton } from '../utils/Automaton';

const App: React.FC = () => {
  const [regex, setRegex] = useState<string>(''); // Expresión regular ingresada por el usuario
  const [automaton, setAutomaton] = useState<Automaton | null>(null);

  const handleBuildNFA = () => {
    const nfa = buildNFAFromRegex(regex); // Construir el autómata usando la función de Thompson
    setAutomaton(nfa); // Actualizar el autómata
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

      {/* Renderizar el gráfico del autómata si existe */}
      {automaton && <AutomatonGraph automaton={automaton} />}
    </div>
  );
};

export default App;
