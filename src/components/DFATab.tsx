import React from 'react';
import AutomatonGraph from './AutomatonGraph';
import { dfaToDot } from '../utils/AutomatonToDot';

interface DFATabProps {
  dfaTransitions: Map<string, Map<string, string>>;
  symbols: string[];
}

const DFATab: React.FC<DFATabProps> = ({ dfaTransitions, symbols }) => {
  return (
    <div>
      {/* Renderizar el gráfico del AFD */}
      <h2>Automata Finito Determinista (DFA)</h2>
      <AutomatonGraph dot={dfaToDot(Array.from(dfaTransitions.entries()), symbols)} />

      {/* Renderizar la tabla de transiciones del AFD */}
      <h2>Tabla de transiciones del DFA</h2>
      <table className="transition-table">
        <thead>
          <tr>
            <th>Estado</th>
            {symbols.map((symbol) => (
              <th key={symbol}>{symbol}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from(dfaTransitions.entries()).map(([state, transitions]) => (
            <tr key={state}>
              <td>{state}</td>
              {symbols.map((symbol) => (
                <td key={symbol}>{transitions.get(symbol) || '-'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DFATab;
