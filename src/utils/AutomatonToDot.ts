import { Automaton, State } from "./Automaton";

// Convierte el autómata en un formato DOT que puede ser visualizado por viz.js
export function visualizeNFA(automaton: Automaton): string {
    const visited = new Set<State>();
    const queue: State[] = [automaton.startState];
    let stateId = 0;
    const stateMap = new Map<State, number>();

    let dot = 'digraph NFA {\n  rankdir=LR;\n  node [shape=circle];\n'; // Inicializa el DOT

    // Bucle para recorrer el autómata y agregar las transiciones
    while (queue.length > 0) {
        const state = queue.shift() as State;
        if (visited.has(state)) continue;
        visited.add(state);

        // Asigna un id numérico al estado si no lo tiene aún
        const currentStateId = stateMap.get(state) || stateId++;
        stateMap.set(state, currentStateId);

        // Marcar el estado como de aceptación si es necesario
        if (state.isAccepting) {
            dot += `  ${currentStateId} [shape=doublecircle];\n`;
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
