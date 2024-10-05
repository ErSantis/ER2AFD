import React from 'react';
import DynamicAutomaton from './DynamicAutomaton';
import TransitionTable from './NFATransitionTable';
import { NFATabProps } from '../types/NFATab.type';

const NFATab: React.FC<NFATabProps> = ({ automaton, symbols, cadena }) => {
  return (
    <div>
      <h2>Automata Finito No Determinista (NFA)</h2>
      
      {/* Renderizar el gráfico del NFA de forma dinámica */}
      <DynamicAutomaton 
        automatonType="NFA"
        automaton={automaton}
        symbols={symbols}
        cadena={cadena} // Cadena de entrada para el recorrido
      />

      {/* Renderizar la tabla de transiciones del NFA */}
      <h2>Tabla de transiciones del NFA</h2>
      <TransitionTable automaton={automaton} />
    </div>
  );
};

export default NFATab;
