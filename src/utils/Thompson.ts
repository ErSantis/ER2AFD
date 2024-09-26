import { Automaton, State, createState } from "./Automaton";

// Crear un autómata simple que reconoce un solo símbolo
export function createBase(symbol: string): Automaton {
  const start = createState();
  const accept = createState();
  start.addTransition(symbol, accept);
  accept.isAccepting = true;
  return new Automaton(start, accept);
}

// Concatenar dos autómatas solapando el estado de aceptación del primero con el estado inicial del segundo
export function concatenate(automaton1: Automaton, automaton2: Automaton): Automaton {
  // Copiar las transiciones del estado inicial del segundo autómata al estado de aceptación del primero
  automaton1.acceptState.transitions = [...automaton2.startState.transitions];
  automaton1.acceptState.isAccepting = automaton2.startState.isAccepting;

  // Actualizar el estado de aceptación del primer autómata para que coincida con el segundo
  return new Automaton(automaton1.startState, automaton2.acceptState);
}

// Realiza la alternancia entre dos autómatas
export function union(automaton1: Automaton, automaton2: Automaton): Automaton {
  const start = createState();
  const accept = createState();
  start.addTransition("&", automaton1.startState);
  start.addTransition("&", automaton2.startState);
  automaton1.acceptState.addTransition("&", accept);
  automaton2.acceptState.addTransition("&", accept);
  //Poner en falso los estados de finalizacion de lo dos automatas
  automaton1.acceptState.isAccepting = false;
  automaton2.acceptState.isAccepting = false;
  //Establecer el nuevo estado de finalizacion
  accept.isAccepting = true; 
  return new Automaton(start, accept);
}

// Cerradura de Kleene (a*)
export function kleeneStar(automaton: Automaton): Automaton {
  const start = createState();
  const accept = createState();
  start.addTransition("&", automaton.startState);
  start.addTransition("&", accept);
  automaton.acceptState.addTransition("&", automaton.startState);
  automaton.acceptState.addTransition("&", accept);
  //Poner en falso los estados de finalizacion de lo dos automatas
  automaton.acceptState.isAccepting = false;
  //Establecer el nuevo estado de finalizacion
  accept.isAccepting = true;
  accept.isAccepting = true
  return new Automaton(start, accept);
}

// Cerradura positiva (a+)
export function kleenePlus(automaton: Automaton): Automaton {
  const start = createState();
  const accept = createState();
  start.addTransition("&", automaton.startState);
  automaton.acceptState.addTransition("&", automaton.startState);
  automaton.acceptState.addTransition("&", accept);
  //Poner en falso los estados de finalizacion de lo dos automatas
  automaton.acceptState.isAccepting = false;
  //Establecer el nuevo estado de finalizacion
  accept.isAccepting = true
  return new Automaton(start, accept);
}

// Operador opcional (a?)
export function optional(automaton: Automaton): Automaton {
  const start = createState();
  const accept = createState();
  start.addTransition("&", automaton.startState);
  start.addTransition("&", accept);
  automaton.acceptState.addTransition("&", accept);
  //Poner en falso los estados de finalizacion de lo dos automatas
  automaton.acceptState.isAccepting = false;
  //Establecer el nuevo estado de finalizacion
  accept.isAccepting = true;
  return new Automaton(start, accept);
}


