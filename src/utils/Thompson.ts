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

  // Función para procesar un símbolo y aplicarle un operador unario si es necesario (*, +, ?)
  const applyUnaryOperator = (symbol?: string | undefined, nextChar?: string | undefined, automaton?: Automaton): Automaton => {
    // Si el automaton es undefined, crear uno nuevo
    if (!automaton) {
      automaton = createBase(symbol!);
    }
    // Aplicar operadores unarios si están presentes
    if (nextChar === '*') {
      return kleeneStar(automaton);
    } else if (nextChar === '+') {
      return kleenePlus(automaton);
    } else if (nextChar === '?') {
      return optional(automaton);
    }
    return automaton;
  };

  // Función para procesar el operador de unión (|)
  const processUnion = () => {
    const rightAutomaton = stack.pop()!;
    const leftAutomaton = stack.pop()!;
    stack.push(union(leftAutomaton, rightAutomaton)); // Realizar la unión
  };

  // Función para procesar la pila de operadores
  const processOperator = () => {
    const operator = operators.pop()!;
    if (operator === '|') {
      processUnion();
    }
  };

  // Extraer la subexpresión entre paréntesis
  const extractSubexpression = (i: number): [string, number] => {
    let subexpression = '';
    let openParens = 1; // Ya hemos encontrado el primer '('

    while (openParens > 0 && i < regex.length) {
      i++;
      const char = regex[i];
      if (char === '(') {
        openParens++;
      } else if (char === ')') {
        openParens--;
      }
      if (openParens > 0) {
        subexpression += char;
      }
    }
    return [subexpression, i];
  };

  // Procesar lado derecho del operador de alternancia (|)
  const processRightSide = (i: number): Automaton | null => {
    let currentAutomaton: Automaton | null = null;

    while (i < regex.length) {
      const char = regex[i];

      // Procesar el lado derecho hasta encontrar un operador que interrumpa
      if (/[a-z0-9]/i.test(char)) {
        const nextChar = regex[i + 1];
        let rightAutomaton = applyUnaryOperator(char, nextChar);

        // Avanzar el índice si hay un operador unario
        if (nextChar === '*' || nextChar === '+' || nextChar === '?') {
          i++
        }

        // Si es el primer autómata del lado derecho, simplemente lo asignamos
        if (!currentAutomaton) {
          currentAutomaton = rightAutomaton;
        } else {
          // Concatenamos si hay más de un símbolo
          currentAutomaton = concatenate(currentAutomaton, rightAutomaton);
        }
      }
      // Salir del bucle si encontramos otro operador
      else if (char === '|' || char === '(' || char === ')') {
        break;
      }

      i++;
    }

    return currentAutomaton;
  };

  // Iterar sobre la expresión regular
  for (let i = 0; i < regex.length; i++) {
    const char = regex[i];

    // Si el carácter es parte del alfabeto (a-z, A-Z, 0-9, etc.)
    if (/[a-z0-9]/i.test(char)) {
      const nextChar = regex[i + 1];
      let currentAutomaton = applyUnaryOperator(char, nextChar);

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
      const rightAutomaton = processRightSide(i + 1);
      if (rightAutomaton) {
        const leftAutomaton = stack.pop()!;
        stack.push(union(leftAutomaton, rightAutomaton)); // Realizar la unión
        break;
      }
    }
    // Procesar el paréntesis de apertura
    else if (char === '(') {
      // Extraer la subexpresión entre paréntesis
      const [subexpression, newIndex] = extractSubexpression(i);
      i = newIndex; // Avanzar el índice al final del paréntesis cerrado

      // Llamar recursivamente a esta función con la subexpresión extraída
      let subAutomaton = buildNFAFromRegex(subexpression);

      // Aplicar un operador unario si está presente después del paréntesis
      const nextChar = regex[i + 1];
      subAutomaton = applyUnaryOperator(undefined, nextChar, subAutomaton);
      if (nextChar === '*' || nextChar === '+' || nextChar === '?') {
        i++; // Saltar el operador unario
      }


      // Si ya hay un autómata en la pila, concatenarlo con el autómata del paréntesis
      if (stack.length > 0) {
        const previousAutomaton = stack.pop()!;
        stack.push(concatenate(previousAutomaton, subAutomaton));
      } else {
        stack.push(subAutomaton);
      }
    }
  }

  // Procesar los operadores restantes fuera de los paréntesis
  while (operators.length > 0) {
    processOperator();
  }

  // Obtener el autómata final de la pila
  const finalAutomaton = stack.pop()!;

  // Retornar el autómata final
  return finalAutomaton;
}
