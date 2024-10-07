import React from 'react';
import DFATransitionTable from './DFATransitionTable';
import StateMap from './DFASubsetsTable';
import { DFATabProps } from '../types/DFATab.type';
import DynamicAutomaton from './DynamicAutomaton';
import { formatIdenticalStates } from '../utils/formatIdenticalStates';
import { useAutomatonContext } from './AutomatonContext';

const DFATab: React.FC<DFATabProps> = ({
  dfaTransitions,
  estadosFinales,
  estadoInicial,
  conjuntoAFNMap,
  estadosSignifitivos,
  isMinimized,
  estadosIdenticos,
}) => {
  const { symbols } = useAutomatonContext()
  return (
    <div className="dfatab-container">
      <div className="dfatab-automaton-container">
        <h2>{isMinimized ? 'Automata Finito Determinista Minimizado (mDFA)' : 'Automata Finito Determinista (DFA)'}</h2>

        <DynamicAutomaton
          dfaTransitions={dfaTransitions}
          estadosFinales={estadosFinales}
          estadoInicial={estadoInicial}
          automatonType={'DFA'}
        />
      </div>

      <div className="dfatab-tables-container">
        <div className="table-container">
          <DFATransitionTable
            dfaTransitions={dfaTransitions}
            symbols={symbols}
            estadosFinales={estadosFinales}
            estadoInicial={estadoInicial}
          />
        </div>

        <div>
          {isMinimized ? (
            <div className="table-container">
              <h2>Estados Significativos</h2>
              <StateMap StateMap={estadosSignifitivos!} />
            </div>
          ) : (
            <div className="table-container2">
              <h2>Correspondencia de Conjuntos AFN a Estados DFA</h2>
              <StateMap StateMap={conjuntoAFNMap!} />
            </div>
          )}
        </div>

        {isMinimized && estadosIdenticos && estadosIdenticos.size > 0 && (
          <div className="equal-container">
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
    </div>
  );
};

export default DFATab;
