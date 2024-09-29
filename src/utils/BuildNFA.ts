import { createBase, kleenePlus, kleeneStar, union, concatenate, optional } from './Thompson';
import { Automaton } from './Automaton';

export function buildNFAFromRegex(regex: string): { automaton: Automaton, alphabet: Set<string> } {
  const stack: Automaton[] = [];
  const operators: string[] = [];
  const alphabet = new Set<string>(); // Almacenar los símbolos que forman parte del alfabeto de la ER

  // Función para procesar un símbolo y aplicarle un operador unario si es necesario (*, +, ?)
  const applyUnaryOperator = (automaton: Automaton, nextChar?: string | undefined): Automaton => {
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
  const processRightSide = (i: number): [Automaton, number] => {
    let rightAutomaton: Automaton | null = null;

    while (i < regex.length) {
      const char = regex[i];

      if (char === '(') {
        // Extraer subexpresión dentro de los paréntesis
        const [subexpression, newIndex] = extractSubexpression(i);
        let subAutomaton = buildNFAFromRegex(subexpression).automaton;

        // Aplicar un operador unario si está presente después de la subexpresión
        const nextChar = regex[newIndex + 1];
        if (nextChar === '*' || nextChar === '+' || nextChar === '?') {
          subAutomaton = applyUnaryOperator(subAutomaton, nextChar);
          i = newIndex + 1; // Saltar el operador unario
        } else {
          i = newIndex;
        }

        // Si es el primer autómata del lado derecho, simplemente lo asignamos
        if (!rightAutomaton) {
          rightAutomaton = subAutomaton;
        } else {
          // Concatenamos si hay más de un símbolo
          rightAutomaton = concatenate(rightAutomaton, subAutomaton);
        }
      }
      // Procesar caracteres normales (a-z, 0-9, &, etc.)
      else if (!['|', '*', '+', '?', '(', ')'].includes(char)) {
        const nextChar = regex[i + 1];
        let currentAutomaton = createBase(char);
        alphabet.add(char); // Añadir el símbolo al alfabeto

        // Avanzar el índice si hay un operador unario
        if (nextChar === '*' || nextChar === '+' || nextChar === '?') {
          currentAutomaton = applyUnaryOperator(currentAutomaton, nextChar);
          i++;
        }

        // Si es el primer autómata del lado derecho, simplemente lo asignamos
        if (!rightAutomaton) {
          rightAutomaton = currentAutomaton;
        } else {
          // Concatenamos si hay más de un símbolo
          rightAutomaton = concatenate(rightAutomaton, currentAutomaton);
        }
      }
      // Salir del bucle si encontramos otro operador o paréntesis
      else if (char === '|' || char === ')') {
        break;
      }

      i++;
    }

    return [rightAutomaton!, i];
  };

  // Iterar sobre la expresión regular
  for (let i = 0; i < regex.length; i++) {
    const char = regex[i];

    // Si el carácter es parte del alfabeto (no es operador especial)
    if (!['|', '*', '+', '?', '(', ')'].includes(char)) {
      const nextChar = regex[i + 1];
      let currentAutomaton = createBase(char);
      alphabet.add(char); // Añadir el símbolo al alfabeto

      // Avanzar el índice si hay un operador unario
      if (nextChar === '*' || nextChar === '+' || nextChar === '?') {
        currentAutomaton = applyUnaryOperator(currentAutomaton, nextChar);
        i++; // Saltar el operador
      }

      // Si ya hay un autómata en la pila y no hay alternancia, concatenarlo con el actual
      if (stack.length > 0 && operators.length === 0) {
        const previousAutomaton = stack.pop()!;
        currentAutomaton = concatenate(previousAutomaton, currentAutomaton); // Concatenar sin transiciones ε
      }

      // Empujar el autómata actual a la pila
      stack.push(currentAutomaton);
    }
    // Procesar el operador de alternancia (|)
    else if (char === '|') {
      // Si ya hemos leído algo antes del '|', significa que estamos en una alternancia
      const leftAutomaton = stack.pop()!;
      const [rightAutomaton, newIndex] = processRightSide(i + 1);
      stack.push(union(leftAutomaton, rightAutomaton)); // Realizar la unión correctamente
      i = newIndex - 1; // Ajustar el índice para continuar desde el final del lado derecho
    }
    // Procesar el paréntesis de apertura
    else if (char === '(') {
      // Extraer la subexpresión entre paréntesis
      const [subexpression, newIndex] = extractSubexpression(i);
      i = newIndex; // Avanzar el índice al final del paréntesis cerrado

      // Llamar recursivamente a esta función con la subexpresión extraída
      let subAutomaton = buildNFAFromRegex(subexpression).automaton;

      // Aplicar un operador unario si está presente después del paréntesis
      const nextChar = regex[i + 1];
      if (nextChar === '*' || nextChar === '+' || nextChar === '?') {
        subAutomaton = applyUnaryOperator(subAutomaton, nextChar);
        i++; // Saltar el operador unario
      }

      // Si ya hay un autómata en la pila, concatenarlo con el autómata del paréntesis
      if (stack.length > 0 && operators.length === 0) {
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

  // Retornar el autómata final junto con el alfabeto
  return { automaton: finalAutomaton, alphabet };
}
