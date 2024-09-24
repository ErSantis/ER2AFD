import { Automaton, State } from "./Automaton";

// Convierte el autómata en un formato DOT que puede ser visualizado por viz.js
export function visualizeNFA(automaton: Automaton): string {
  let dot = 'digraph NFA {\n  rankdir=LR;\n  node [shape=circle];\n'; // Inicializa el DOT

  const visited = new Set<State>(); // Para evitar visitar estados repetidos
  const queue: State[] = [automaton.startState]; // Comenzamos desde el estado inicial

  // Mientras haya estados por procesar
  while (queue.length > 0) {
    const currentState = queue.shift() as State;

    if (visited.has(currentState)) continue; // Evitar repetir estados ya procesados
    visited.add(currentState); // Marcamos este estado como procesado

    // Si es un estado de aceptación, lo mostramos con doble círculo
    if (currentState.isAccepting) {
      dot += `  ${currentState.id} [shape=doublecircle];\n`;
    }

    // Procesamos las transiciones de este estado
    currentState.transitions.forEach(({ symbol, state: nextState }) => {
      dot += `  ${currentState.id} -> ${nextState.id} [label="${symbol || 'ε'}"];\n`;
      if (!visited.has(nextState)) {
        queue.push(nextState); // Agregar el siguiente estado a la cola si no ha sido visitado
      }
    });
  }

  dot += '}'; // Cerrar el grafo DOT
  return dot;
}
