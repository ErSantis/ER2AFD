import React, { useEffect, useState } from 'react';
import AutomatonGraph from './AutomatonGraph';
import { dfaToDot } from '../utils/AutomatonToDot';
import DFATransitionTable from './DFATransitionTable';
import AFNToDFAStateMap from './DFASubsetsTable';
import { DFATabProps } from '../types/DFATab.type';

const DFATab: React.FC<DFATabProps> = ({
  dfaTransitions,
  symbols,
  estadosFinales,
  estadoInicial,
  conjuntoAFNMap,
  isMinimized,
}) => {
  const [dot, setDot] = useState<string>(''); // Estado para el string DOT

  // Regenerar la cadena DOT cada vez que cambien las transiciones, símbolos o estados
  useEffect(() => {
    if (dfaTransitions && symbols.length > 0) {
      const dotRepresentation = dfaToDot(Array.from(dfaTransitions.entries()), symbols, estadosFinales, estadoInicial);
      setDot(dotRepresentation); // Actualizamos el estado de DOT
    }
  }, [dfaTransitions, symbols, estadosFinales, estadoInicial]); // Aseguramos que estas dependencias están observadas

  return (
    <div>
      <h2>{isMinimized ? 'Automata Finito Determinista Minimizado (mDFA)' : 'Automata Finito Determinista (DFA)'}</h2>

      {/* Renderizar el gráfico del AFD */}
      <AutomatonGraph dot={dot} />

      {/* Renderizar la tabla de transiciones utilizando el nuevo componente */}
      <DFATransitionTable
        dfaTransitions={dfaTransitions}
        symbols={symbols}
        estadosFinales={estadosFinales}
        estadoInicial={estadoInicial}
      />

      {/* Renderiza la tabla de estados del AFD y su equivalencia en estados del AFN */}
      <h2>{isMinimized ? "Estados significativos" : "Correspondencia de Conjuntos AFN a Estados DFA"}</h2>
      <AFNToDFAStateMap conjuntoAFNMap={conjuntoAFNMap} />
    </div>
  );
};

export default DFATab;
