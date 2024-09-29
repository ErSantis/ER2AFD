import React from 'react';
import { Automaton, State } from '../utils/Automaton';
import '../styles/TransitionTable.css';

interface TransitionTableProps {
    automaton: Automaton;
}

// Definir una estructura que asegure que 'state' no se confunda con los símbolos
interface TransitionRow {
    state: number; // La propiedad state es específica y no se mezcla con los índices dinámicos
    transitions: {
        [symbol: string]: number[] | undefined; // El resto son símbolos dinámicos que representan las transiciones
    };
}

const TransitionTable: React.FC<TransitionTableProps> = ({ automaton }) => {
    const generateTable = (): { transitions: TransitionRow[], symbols: string[] } => {
        const transitions: TransitionRow[] = [];
        const visited = new Set<State>();
        const queue: State[] = [automaton.startState];
        let stateId = 0;
        const stateMap = new Map<State, number>();
        const symbolsSet = new Set<string>(); // Almacenar símbolos dinámicos

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

            // Crear una fila para este estado con un objeto de transiciones vacío
            const row: TransitionRow = { state: currentStateId, transitions: {} };

            // Recorre todas las transiciones del estado actual
            state.transitions.forEach(({ symbol, state: nextState }) => {
                // Asignar un ID al estado siguiente si no tiene uno
                if (!stateMap.has(nextState)) {
                    stateMap.set(nextState, stateId++);
                }

                const nextStateId = stateMap.get(nextState)!;

                // Añadir el símbolo al conjunto de símbolos dinámicos (alfabeto)
                const symbolKey = symbol || '&'; // Usamos '&' para transiciones ε
                symbolsSet.add(symbolKey);

                // Añadir las transiciones a la fila correspondiente
                if (!row.transitions[symbolKey]) {
                    row.transitions[symbolKey] = [];
                }
                (row.transitions[symbolKey] as number[]).push(nextStateId);

                // Añadir el siguiente estado a la cola si aún no lo hemos visitado
                if (!visited.has(nextState)) {
                    queue.push(nextState);
                }
            });

            // Añadir la fila de transiciones a la tabla
            transitions.push(row);
        }

        return { transitions, symbols: Array.from(symbolsSet) };
    };

    const { transitions, symbols } = generateTable();

    return (
        <table className="transition-table">
            <thead>
                <tr>
                    <th>State</th>
                    {symbols.map(symbol => (
                        <th key={symbol}>{symbol}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {transitions.map((row, index) => (
                    <tr key={index}>
                        <td>{row.state}</td>
                        {symbols.map(symbol => (
                            <td key={symbol}>{row.transitions[symbol] ? row.transitions[symbol]!.toString() : '-'}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TransitionTable;
