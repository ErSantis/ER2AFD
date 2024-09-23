// Representa un estado en el autómata, con posibles transiciones a otros estados
export class State {
  transitions: { symbol: string | null; state: State }[] = []; // Array para almacenar las transiciones
  isAccepting: boolean = false; // Indica si el estado es un estado de aceptación

  // Método para añadir una transición
  // Symbol: simbolo del alfabeto, state: estado destino de la transición
  addTransition(symbol: string | null, state: State): void {
    this.transitions.push({ symbol, state });
  }
}

// Representa un autómata con un estado inicial y uno de aceptación.
export class Automaton {
  startState: State; // Estado de inicio
  acceptState: State; // Estado de aceptación

  constructor(startState: State, acceptState: State) {
    this.startState = startState;
    this.acceptState = acceptState;
  }
}
