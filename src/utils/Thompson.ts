import { Automaton, State } from "./automaton";

//Crear un automata simple que reconoce un solo simbolo
function createBase(symbol: string): Automaton {
  const start = new State();
  const accept = new State();
  start.addTransition(symbol, accept);
  return new Automaton(start, accept);
}

//Une dos automatas simples por medio de un simbolo
function concatenate(
  automaton1: Automaton,
  automaton2: Automaton,
  symbol: string
): Automaton {
  automaton1.acceptState.addTransition(symbol,automaton2.acceptState);
  return new Automaton(automaton1.startState, automaton2.acceptState);
}

// Realiza la alternancia entre dos automatas
function union(automaton1: Automaton, automaton2: Automaton): Automaton {
  const start = new State();
  const accept = new State();
  start.addTransition("&", automaton1.startState);
  start.addTransition("&", automaton2.startState);
  automaton1.acceptState.addTransition("&", accept);
  automaton2.acceptState.addTransition("&", accept);
  return new Automaton(start, accept);
}

// Cerradura de Kleene para un automata
function kleeneStar(automatan: Automaton): Automaton {
  const start = new State();
  const accept = new State();
  start.addTransition("&", automatan.startState);
  start.addTransition("&", accept);
  automatan.acceptState.addTransition(null, automatan.startState);
  automatan.acceptState.addTransition(null, accept);
  return new Automaton(start, accept);
}

// Cerradura de Kleene positiva para un automata
function kleenePlus(automaton: Automaton) {
  const start = new State();
  const accept = new State();
  start.addTransition("&", automaton.startState);
  automaton.acceptState.addTransition("&", automaton.startState);
  automaton.acceptState.addTransition("&", accept);
  return new Automaton(start, accept);
}

// Aplica el operador opcional (?)
function optional(automaton: Automaton): Automaton {
  const start = new State();
  const accept = new State();
  start.addTransition("&", automaton.startState);
  start.addTransition("&", accept);
  automaton.acceptState.addTransition("&", accept);
  return new Automaton(start, accept);
}

export function buildNFAFromRegex(regex: string): Automaton {
  const stack: Automaton[] = [];

  for (let i = 0; i < regex.length; i++) {
    const char = regex[i];

    if (char === "(") {
      //Logica para cuando sea asi
    } else {
      const automaton = createBase(char);
      if (regex[i + 1] === "*") {
        stack.push(kleeneStar(automaton));
      } else if (regex[i + 1] === "+") {
        stack.push(kleenePlus(automaton));
      } else if (regex[i + 1] === "?") {
        stack.push(optional(automaton));
      } else {
        stack.push(automaton);
      }
    }

    if (stack.length == 2) {
      const a2 = stack.pop();
      const a1 = stack.pop();
      if (a1 && a2) stack.push(concatenate(a1, a2, char));
    }
  }

  // const operators: string[] = [];

  // const precedence: { [key: string]: number } = {
  //   '|': 1,
  //   '.': 2,
  //   '*': 3,
  //   '?': 3
  // };

  // const processOperator = (operator: string) => {
  //   if (operator === '|') {
  //     const a2 = stack.pop();
  //     const a1 = stack.pop();
  //     if (a1 && a2) stack.push(union(a1, a2));
  //   } else if (operator === '.') {
  //     const a2 = stack.pop();
  //     const a1 = stack.pop();
  //     console.log(a1, a2);
  //     if (a1 && a2) stack.push(concatenate(a1, a2));
  //   } else if (operator === '*') {
  //     const a = stack.pop();
  //     if (a) stack.push(kleeneStar(a));
  //   } else if (operator === '?') {
  //     const a = stack.pop();
  //     if (a) stack.push(optional(a));
  //   }
  // };

  // for (let i = 0; i < regex.length; i++) {
  //   const char = regex[i];
  //     console.log(stack)
  //     console.log(operators)
  //   if (char === '(') {
  //     operators.push(char);
  //   } else if (char === ')') {
  //     while (operators.length && operators[operators.length - 1] !== '(') {
  //       processOperator(operators.pop() as string);
  //     }
  //     operators.pop();
  //   } else if (char === '|' || char === '.' || char === '*' || char === '?') {
  //     while (operators.length && precedence[operators[operators.length - 1]] >= precedence[char]) {
  //       processOperator(operators.pop() as string);
  //     }
  //     operators.push(char);
  //   } else {
  //     stack.push(createBase(char));
  //   }
  // }

  // while (operators.length) {
  //   processOperator(operators.pop() as string);
  // }

  return stack.pop() as Automaton;
}
