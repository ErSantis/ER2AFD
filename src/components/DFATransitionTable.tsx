import React from 'react';
import { DFATransitionTableProps } from '../types/DFATransitionTable.type';

const DFATransitionTable: React.FC<DFATransitionTableProps> = ({ dfaTransitions, symbols, estadoInicial, estadosFinales }) => {
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
              <td>
                {state === estadoInicial && '→'}
                {estadosFinales.has(state) && '*'}
                {state}
              </td>
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
