import { Automaton } from "../models/Automaton";
import { State } from "../models/State";

// Convierte el autómata NFA en un formato DOT que puede ser visualizado por viz.js
export function nfaToDot(
  automaton: Automaton, 
  recorrido: { estadoActual: string, siguienteEstado: string, simbolo: string }[], 
  estadoResaltado: string | null, 
  transicionResaltada: { estadoActual: string, siguienteEstado: string } | null,
  estadoFinalAlcanzado: string | null
): string {
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

    // Asignar el id de la etiqueta al id del estado
    state.id = currentStateId;

    // Marcar el estado como de aceptación si es necesario
    let estadoStyle = 'shape=circle';
    let colorStyle = '';

    if (state.isAccepting) {
      estadoStyle = 'shape=doublecircle';
    }

    // Resaltar el estado si corresponde al estado resaltado actual
    if (estadoFinalAlcanzado === currentStateId.toString()) {
      colorStyle = 'style=filled, fillcolor=green, color=green';
    } else if (estadoResaltado === currentStateId.toString()) {
      colorStyle = 'style=filled, fillcolor=yellow';
    }

    dot += `  ${currentStateId} [label="${currentStateId}", ${estadoStyle}, ${colorStyle}];\n`;

    // Recorrer las transiciones del estado actual
    state.transitions.forEach(({ symbol, state: nextState }) => {
      const nextStateId = stateMap.get(nextState) || stateId++;
      stateMap.set(nextState, nextStateId);

      let transicionColor = '';

      // Resaltar la transición si es la resaltada actualmente
      if (transicionResaltada && transicionResaltada.estadoActual === currentStateId.toString() && transicionResaltada.siguienteEstado === nextStateId.toString()) {
        transicionColor = 'color=red, penwidth=2';
      }

      // Agregar la transición al DOT
      dot += `  ${currentStateId} -> ${nextStateId} [label="${symbol || 'ε'}" ${transicionColor}];\n`;

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
    estadoInicial: string, 
    recorrido: { estadoActual: string, siguienteEstado: string, simbolo: string }[], 
    estadoResaltado: string | null,
    transicionResaltada: { estadoActual: string, siguienteEstado: string } | null,
    estadoFinalAlcanzado: string | null
  ): string {
      let dot = 'digraph DFA {\n  rankdir=LR;\n  node [shape=circle];\n';
  
      // Marcar el estado inicial con una flecha que lo apunte
      dot += `  start [shape=point];\n  start -> ${estadoInicial};\n`;
  
      transitionTable.forEach(([state, transitions]) => {
          let estadoStyle = 'shape=circle';
          let colorStyle = '';
  
          // Si el estado actual es un estado de aceptación
          if (estadosFinales.has(state)) {
              estadoStyle = 'shape=doublecircle';
          }
  
          // Si es el estado resaltado y final alcanzado, darle borde verde y relleno verde claro
          if (estadoFinalAlcanzado === state) {
              colorStyle = 'style=filled, fillcolor=green, color=green';
          } else if (estadoResaltado === state) {
              colorStyle = 'style=filled, fillcolor=yellow';
          }
  
          dot += `  ${state} [label="${state}", ${estadoStyle}, ${colorStyle}];\n`;
  
          // Recorrer las transiciones para cada símbolo en el alfabeto
          alphabet.forEach((symbol) => {
              const targetState = transitions.get(symbol);
              if (targetState) {
                  const transicionColor = (transicionResaltada && transicionResaltada.estadoActual === state && transicionResaltada.siguienteEstado === targetState) 
                                          ? 'color=red, penwidth=2' 
                                          : '';
                  dot += `  ${state} -> ${targetState} [label="${symbol}" ${transicionColor}];\n`;
              }
          });
      });
  
      dot += '}';
      return dot;
  }
  