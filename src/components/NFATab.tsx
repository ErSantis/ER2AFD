import React from 'react';
import DynamicAutomaton from './DynamicAutomaton';
import TransitionTable from './NFATransitionTable';
import { NFATabProps } from '../types/NFATab.type';

const NFATab: React.FC<NFATabProps> = ({ automaton}) => {
  return (
    <div className="nfa-tab-container">
      
      <div className="automaton-container">
      <h2>Automata Finito No Determinista (NFA)</h2>
        <DynamicAutomaton 
          automatonType="NFA"
          automaton={automaton}
        />
      </div>

      <div className="transition-table-container">
      <h2>Tabla de transiciones del NFA</h2>
        <TransitionTable automaton={automaton} />
      </div>
    </div>
  );
};

export default NFATab;
