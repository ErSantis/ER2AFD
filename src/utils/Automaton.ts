export class State {
  id: number;
  transitions: { symbol: string | null; state: State }[] = [];
  isAccepting: boolean = false;

  constructor(id: number) {
    this.id = id;
  }

  // Método para añadir una transición
  addTransition(symbol: string | null, state: State): void {
    this.transitions.push({ symbol, state });
  }
}

export class Automaton {
  startState: State;
  acceptState: State;

  constructor(startState: State, acceptState: State) {
    this.startState = startState;
    this.acceptState = acceptState;
  }
}

let stateCounter = 0;

export function createState(): State {
  return new State(stateCounter++);
}
