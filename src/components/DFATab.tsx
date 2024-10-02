import React from 'react';
import AutomatonGraph from './AutomatonGraph';
import { dfaToDot } from '../utils/AutomatonToDot';
import DFATransitionTable from './DFATransitionTable';
import AFNToDFAStateMap from './DFASubsetsTable';
import { DFATabProps } from '../types/DFATab.type';

const DFATab: React.FC<DFATabProps> = ({ dfaTransitions, symbols, estadosFinales, estadoInicial, conjuntoAFNMap, estadoSignificativos }) => {
  //Ver en estados significativos que letra tiene el mismo conjunto de estados y eliminar la segunda aparicion
  
  
  return (
    <div>
      {/* Renderizar el gráfico del AFD */}
      <h2>Automata Finito Determinista (DFA)</h2>
      <AutomatonGraph dot={dfaToDot(Array.from(dfaTransitions.entries()), symbols, estadosFinales, estadoInicial)} />

      {/* Renderizar la tabla de transiciones utilizando el nuevo componente */}
      <DFATransitionTable dfaTransitions={dfaTransitions} symbols={symbols} estadosFinales={estadosFinales} estadoInicial={estadoInicial}/>

      {/* Renderiza la tabla de estados del AFD y su equivalencia en estados del AFN */}
      <AFNToDFAStateMap conjuntoAFNMap={conjuntoAFNMap} />
    </div>
  );
};

export default DFATab;
