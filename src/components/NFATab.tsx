import React from 'react';
import AutomatonGraph from './AutomatonGraph';
import TransitionTable from './TransitionTable';
import { Automaton } from '../models/Automaton';
import { nfaToDot } from '../utils/AutomatonToDot';

interface NFATabProps {
  automaton: Automaton;
  symbols: string[];
}

const NFATab: React.FC<NFATabProps> = ({ automaton, symbols }) => {
  return (
    <div>
      {/* Renderizar el gráfico del AFN */}
      <h2>Automata Finito No Determinista (NFA)</h2>
      <AutomatonGraph dot={nfaToDot(automaton)} />

      {/* Renderizar la tabla de transiciones del AFN */}
      <h2>Tabla de transiciones del NFA</h2>
      <TransitionTable automaton={automaton} />
    </div>
  );
};

export default NFATab;
