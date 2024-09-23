import { Automaton, State } from "./automaton";

export function visualizeNFA(automaton: Automaton): string[] {
  const visited = new Set<State>();
  const queue: State[] = [automaton.startState];
  let stateId = 0;
  const stateMap = new Map<State, number>();

  const transitions: string[] = [];

  while (queue.length > 0) {
    const state = queue.shift() as State;
    if (visited.has(state)) continue;
    visited.add(state);

    const currentStateId = stateMap.get(state) || stateId++;
    stateMap.set(state, currentStateId);

    state.transitions.forEach(({ symbol, state: nextState }) => {
      const nextStateId = stateMap.get(nextState) || stateId++;
      stateMap.set(nextState, nextStateId);
      transitions.push(`State ${currentStateId} --${symbol || 'ε'}--> State ${nextStateId}`);
      if (!visited.has(nextState)) queue.push(nextState);
    });
  }

  return transitions;
}
