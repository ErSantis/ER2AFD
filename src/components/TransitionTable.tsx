import React from 'react';
import { Automaton, State } from '../utils/Automaton';
import '../styles/TransitionTable.css'

interface TransitionTableProps {
    automaton: Automaton;
}

type TransitionRow = {
    state: number;
    a?: number[] | string;
    b?: number[] | string;
    '&'?: number[] | string;
};

const TransitionTable: React.FC<TransitionTableProps> = ({ automaton }) => {
    const generateTable = (): TransitionRow[] => {
        const transitions: TransitionRow[] = [];
        const visited = new Set<State>();
        const queue: State[] = [automaton.startState];
        let stateId = 0;
        const stateMap = new Map<State, number>();

        // Asigna un id numérico al estado de inicio
        const startStateId = stateId++;
        stateMap.set(automaton.startState, startStateId);

        // Bucle para recorrer el autómata y generar las transiciones
        while (queue.length > 0) {
            const state = queue.shift() as State;
            if (visited.has(state)) continue;
            visited.add(state);

            // Obtener el id del estado actual
            const currentStateId = stateMap.get(state) as number;

            // Crear una fila para este estado
            const row: TransitionRow = { state: currentStateId };

            // Recorre todas las transiciones del estado actual
            state.transitions.forEach(({ symbol, state: nextState }) => {
                // Asignar un ID al estado siguiente si no tiene uno
                if (!stateMap.has(nextState)) {
                    stateMap.set(nextState, stateId++);
                }

                const nextStateId = stateMap.get(nextState)!;

                // Añadir las transiciones a la fila correspondiente
                const symbolKey = symbol || '&'; // Usamos 'ε' para transiciones sin símbolo
                if (!row[symbolKey]) {
                    row[symbolKey] = [];
                }
                if (typeof row[symbolKey] === 'string') {
                    row[symbolKey] = [nextStateId];
                } else {
                    (row[symbolKey] as number[]).push(nextStateId);
                }

                // Añadir el siguiente estado a la cola si aún no lo hemos visitado
                if (!visited.has(nextState)) {
                    queue.push(nextState);
                }
            });

            // Añadir la fila de transiciones a la tabla
            transitions.push(row);
        }

        return transitions;
    };

    const transitions = generateTable();

    return (
        <table className="transition-table">
            <thead>
                <tr>
                    <th>State</th>
                    <th>a</th>
                    <th>b</th>
                    <th>&</th>
                </tr>
            </thead>
            <tbody>
                {transitions.map((row, index) => (
                    <tr key={index}>
                        <td>{row.state}</td>
                        <td>{row.a ? row.a.toString() : '-'}</td>
                        <td>{row.b ? row.b.toString() : '-'}</td>
                        <td>{row['&'] ? row['&'].toString() : '-'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TransitionTable;
