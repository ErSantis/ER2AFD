import React from 'react';
import DFATransitionTable from './DFATransitionTable';
import StateMap from './DFASubsetsTable';
import { DFATabProps } from '../types/DFATab.type';
import DynamicAutomaton from './DynamicAutomaton';
import { formatIdenticalStates } from '../utils/formatIdenticalStates';

const DFATab: React.FC<DFATabProps> = ({
  dfaTransitions,
  symbols,
  estadosFinales,
  estadoInicial,
  conjuntoAFNMap,
  estadosSignifitivos,
  isMinimized,
  estadosIdenticos,
  cadena
}) => {

  return (
    <div>
      <h2>{isMinimized ? 'Automata Finito Determinista Minimizado (mDFA)' : 'Automata Finito Determinista (DFA)'}</h2>

      {/* Renderizar el gráfico del AFD */}
      <DynamicAutomaton
        dfaTransitions={dfaTransitions}
        symbols={symbols}
        estadosFinales={estadosFinales}
        estadoInicial={estadoInicial}
        cadena={cadena}
        automatonType={'DFA'}
      />

      {/* Renderizar la tabla de transiciones utilizando el nuevo componente */}
      <DFATransitionTable
        dfaTransitions={dfaTransitions}
        symbols={symbols}
        estadosFinales={estadosFinales}
        estadoInicial={estadoInicial}
      />

      {/* Renderiza la tabla de estados del AFD y su equivalencia en estados del AFN */}
      {isMinimized ? (
        <div>
          <h2>Estados Significativos</h2>
          <StateMap StateMap={estadosSignifitivos!} />
        </div>
      ) : (
        <div>
          <h2>Correspondencia de Conjuntos AFN a Estados DFA</h2>
          <StateMap StateMap={conjuntoAFNMap!} />
        </div>
      )}

      {/* Mostrar la tabla de estados idénticos solo si el autómata está minimizado y hay estados idénticos */}
      {isMinimized && estadosIdenticos && (
        <div>
          <h2>Estados Idénticos</h2>
          <ul>
            {Array.from(estadosIdenticos.entries()).map(([estadoRepresentativo, equivalentes]) => (
              <li key={estadoRepresentativo}>
                {formatIdenticalStates([...equivalentes])}
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};

export default DFATab;
