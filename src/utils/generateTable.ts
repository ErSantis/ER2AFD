import { TransitionRow } from "../types/TransitionTable.type";
import { Automaton } from "../models/Automaton";
import { State } from "../models/State";


export const generateTable = (automaton: Automaton): { transitions: TransitionRow[], symbols: string[] } => {
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
