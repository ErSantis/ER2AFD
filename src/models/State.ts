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