import React from 'react';
import { StateMapProps } from '../types/DFASubsetsTable.type';

const StateMap: React.FC<StateMapProps> = ({ StateMap }) => {
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
          {Array.from(StateMap.entries()).map(([letra, conjunto]) => (
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
