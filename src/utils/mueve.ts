import { State } from '../models/State';
export function mueve(state: State, symbol: string): Set<State> {
    const reachableStates = new Set<State>();
    
    state.transitions.forEach(({ symbol: transitionSymbol, state: nextState }) => {
      if (transitionSymbol === symbol) {
        reachableStates.add(nextState);
      }
    });
  
    return reachableStates;
  }