import { Automaton, State, createState } from "./Automaton";

// Crear un autómata simple que reconoce un solo símbolo
function createBase(symbol: string): Automaton {
  const start = createState();
  const accept = createState();
  start.addTransition(symbol, accept);
  return new Automaton(start, accept);
}

// Concatenar dos autómatas solapando el estado de aceptación del primero con el estado inicial del segundo
function concatenate(automaton1: Automaton, automaton2: Automaton): Automaton {
  // Copiar las transiciones del estado inicial del segundo autómata al estado de aceptación del primero
  automaton1.acceptState.transitions = [...automaton2.startState.transitions];
  automaton1.acceptState.isAccepting = automaton2.startState.isAccepting;

  // Actualizar el estado de aceptación del primer autómata para que coincida con el segundo
  return new Automaton(automaton1.startState, automaton2.acceptState);
}

// Realiza la alternancia entre dos autómatas
function union(automaton1: Automaton, automaton2: Automaton): Automaton {
  const start = createState();
  const accept = createState();
  start.addTransition("&", automaton1.startState);
  start.addTransition("&", automaton2.startState);
  automaton1.acceptState.addTransition("&", accept);
  automaton2.acceptState.addTransition("&", accept);
  return new Automaton(start, accept);
}

// Cerradura de Kleene (a*)
function kleeneStar(automaton: Automaton): Automaton {
  const start = createState();
  const accept = createState();
  start.addTransition("&", automaton.startState);
  start.addTransition("&", accept);
  automaton.acceptState.addTransition("&", automaton.startState);
  automaton.acceptState.addTransition("&", accept);
  return new Automaton(start, accept);
}

// Cerradura positiva (a+)
function kleenePlus(automaton: Automaton): Automaton {
  const start = createState();
  const accept = createState();
  start.addTransition("&", automaton.startState);
  automaton.acceptState.addTransition("&", automaton.startState);
  automaton.acceptState.addTransition("&", accept);
  return new Automaton(start, accept);
}

// Operador opcional (a?)
function optional(automaton: Automaton): Automaton {
  const start = createState();
  const accept = createState();
  start.addTransition("&", automaton.startState);
  start.addTransition("&", accept);
  automaton.acceptState.addTransition("&", accept);
  return new Automaton(start, accept);
}

export function buildNFAFromRegex(regex: string): Automaton {
  const stack: Automaton[] = [];
  const operators: string[] = [];

  // Función auxiliar para procesar un símbolo y aplicarle un operador unario si es necesario
  const processSymbol = (symbol: string, nextChar: string | undefined): Automaton => {
    let automaton = createBase(symbol);

    // Aplicar operadores unarios si están presentes
    if (nextChar === '*') {
      automaton = kleeneStar(automaton);
    } else if (nextChar === '+') {
      automaton = kleenePlus(automaton);
    } else if (nextChar === '?') {
      automaton = optional(automaton);
    }

    return automaton;
  };

  // Iterar sobre la expresión regular
  for (let i = 0; i < regex.length; i++) {
    const char = regex[i];

    // Si el carácter es parte del alfabeto (a-z, A-Z, 0-9, etc.)
    if (/[a-z0-9]/i.test(char)) {
      const nextChar = regex[i + 1]; // Ver el siguiente carácter
      let currentAutomaton = processSymbol(char, nextChar);

      // Avanzar el índice si hay un operador unario
      if (nextChar === '*' || nextChar === '+' || nextChar === '?') {
        i++; // Saltar el operador
      }

      // Si ya hay un autómata en la pila, concatenarlo con el actual
      if (stack.length > 0 && operators.length === 0) {
        const previousAutomaton = stack.pop()!;
        currentAutomaton = concatenate(previousAutomaton, currentAutomaton); // Concatenar sin transiciones ε
      }

      // Empujar el autómata actual a la pila
      stack.push(currentAutomaton);
    }
    // Procesar el operador de alternancia (|)
    else if (char === '|') {
      operators.push('|'); // Agregar el operador '|' a la pila de operadores
    }
    // Procesar el paréntesis de apertura
    else if (char === '(') {
      operators.push('('); // Agregar el paréntesis a la pila de operadores
    }
    // Procesar el paréntesis de cierre
    else if (char === ')') {
      // Procesar todo lo que esté dentro de los paréntesis
      while (operators.length > 0 && operators[operators.length - 1] !== '(') {
        const operator = operators.pop()!;
        if (operator === '|') {
          const automaton2 = stack.pop()!;
          const automaton1 = stack.pop()!;
          stack.push(union(automaton1, automaton2)); // Realizar la unión (a|b)
        }
      }
      operators.pop(); // Sacar el paréntesis de apertura '(' de la pila
    }
  }

  // Procesar los operadores restantes fuera de los paréntesis
  while (operators.length > 0) {
    const operator = operators.pop()!;
    if (operator === '|') {
      const automaton2 = stack.pop()!;
      const automaton1 = stack.pop()!;
      stack.push(union(automaton1, automaton2)); // Realizar la unión para a|b
    }
  }

  // Obtener el autómata final de la pila
  const finalAutomaton = stack.pop()!;

  // Retornar el autómata final
  return finalAutomaton;
}
