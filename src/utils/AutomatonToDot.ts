import { Automaton } from "../models/Automaton";
import { State } from "../models/State";
// Convierte el autómata en un formato DOT que puede ser visualizado por viz.js
export function nfaToDot(automaton: Automaton): string {
    const visited = new Set<State>();
    const queue: State[] = [automaton.startState];
    let stateId = 0;
    const stateMap = new Map<State, number>();

    let dot = 'digraph NFA {\n  rankdir=LR;\n  node [shape=circle];\n'; // Inicializa el DOT

    // Asigna un id numérico al estado de inicio
    const startStateId = stateId++;
    stateMap.set(automaton.startState, startStateId);

    // Agregar una flecha al estado de inicio
    dot += `  start [shape=point];\n  start -> ${startStateId};\n`;

    // Bucle para recorrer el autómata y agregar las transiciones
    while (queue.length > 0) {
        const state = queue.shift() as State;
        if (visited.has(state)) continue;
        visited.add(state);

        // Obtener el id del estado actual
        const currentStateId = stateMap.get(state) as number;

        //Asignar el id de la etiqueta al id del estado
        state.id = currentStateId;

        // Marcar el estado como de aceptación si es necesario
        if (state.isAccepting) {
            dot += `  ${state.id} [shape=doublecircle];\n`;
        }

        // Agregar las transiciones al DOT
        state.transitions.forEach(({ symbol, state: nextState }) => {
            const nextStateId = stateMap.get(nextState) || stateId++;
            stateMap.set(nextState, nextStateId);

            // Agregar la transición en formato DOT
            dot += `  ${currentStateId} -> ${nextStateId} [label="${symbol || 'ε'}"];\n`;

            if (!visited.has(nextState)) {
                queue.push(nextState);
            }
        });
    }

    dot += '}'; // Cerrar el grafo DOT
    return dot;
}

export function dfaToDot(
    transitionTable: [string, Map<string, string>][], 
    alphabet: string[], 
    estadosFinales: Set<string>, 
    estadoInicial: string
): string {
    let dot = 'digraph DFA {\n  rankdir=LR;\n  node [shape=circle];\n';

    // Marcar el estado inicial con una flecha que lo apunte
    dot += `  start [shape=point];\n  start -> ${estadoInicial};\n`;

    transitionTable.forEach(([state, transitions]) => {
        // Marcar el estado actual
        dot += `  ${state} [label="${state}"];\n`;

        // Si el estado actual es un estado de aceptación, marcarlo como doublecircle
        if (estadosFinales.has(state)) {
            dot += `  ${state} [shape=doublecircle];\n`;
        }

        // Recorrer las transiciones para cada símbolo en el alfabeto
        alphabet.forEach((symbol) => {
            const targetState = transitions.get(symbol);
            if (targetState) {
                dot += `  ${state} -> ${targetState} [label="${symbol}"];\n`;
            }
        });
    });

    dot += '}';
    return dot;
}
