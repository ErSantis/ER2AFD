import React, { useState } from 'react';
import { buildNFAFromRegex } from '../utils/BuildNFA';
import AutomatonGraph from './AutomatonGraph';
import TransitionTable from './TransitionTable';
import { Automaton } from '../utils/Automaton';

const App: React.FC = () => {
  const [regex, setRegex] = useState<string>('');
  const [automaton, setAutomaton] = useState<Automaton | null>(null);

  const handleBuildNFA = () => {
    const nfa = buildNFAFromRegex(regex);
    setAutomaton(nfa);
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

      {/* Renderiza el gráfico del autómata */}
      {automaton && <AutomatonGraph automaton={automaton} />}

      {/* Renderiza la tabla de transiciones */}
      {automaton && <TransitionTable automaton={automaton} />}
    </div>
  );
};

export default App;
