import { State } from '../models/State';

export function cerraduraE(state: State): Set<State> {
    const closure = new Set<State>();
    const stack: State[] = [state];

    while (stack.length > 0) {
        const currentState = stack.pop()!;
        if (!closure.has(currentState)) {
            closure.add(currentState);
            currentState.transitions.forEach(({ symbol, state: nextState }) => {
                if (symbol === '&') { // Transición épsilon
                    stack.push(nextState);
                }
            });
        }
    }

    return closure;
}