import React from 'react';
import { AFNToDFAStateMapProps } from '../types/DFASubsetsTable.type';

const StateMap: React.FC<AFNToDFAStateMapProps> = ({ conjuntoAFNMap }) => {
  return (
    <div>
      <table className="transition-table">
        <thead>
          <tr>
            <th>Estado DFA</th>
            <th>Conjunto de Estados AFN</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(conjuntoAFNMap.entries()).map(([letra, conjunto]) => (
            <tr key={letra}>
              <td>{letra}</td>
              <td>
                {'{'}
                {Array.from(conjunto)
                  .map((state) => state.id)
                  .sort((a, b) => a - b)
                  .join(', ')}
                {'}'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StateMap;
