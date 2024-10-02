import React from 'react';

interface DFATransitionTableProps {
  dfaTransitions: Map<string, Map<string, string>>;
  symbols: string[];
}

const DFATransitionTable: React.FC<DFATransitionTableProps> = ({ dfaTransitions, symbols }) => {
  return (
    <div>
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

export default DFATransitionTable;
