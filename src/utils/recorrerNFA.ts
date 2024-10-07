import { TransitionRow } from "../types/TransitionTable.type";

export function recorrerNFA(
  cadena: string,
  transitions: TransitionRow[],
  symbols: string[],
  estadoInicial: string,
  estadosFinales: Set<string>
): { recorrido: { estadoActual: string, siguienteEstado: string, simbolo: string }[]; esAceptado: boolean } {

  const recorrido: { estadoActual: string, siguienteEstado: string, simbolo: string }[] = [];
  let esAceptado = false;

  // Pila para realizar el backtracking y manejar múltiples rutas
  const stack: { estadoActual: string, restanteCadena: string, recorridoActual: { estadoActual: string, siguienteEstado: string, simbolo: string }[] }[] = [];

  // Iniciamos desde el estado inicial
  stack.push({
    estadoActual: estadoInicial,
    restanteCadena: cadena === "&" ? "" : cadena, // Si la cadena es "&", la tratamos como vacía
    recorridoActual: []
  });

  let ultimoRecorrido: { estadoActual: string, siguienteEstado: string, simbolo: string }[] = []; // Guardar el último recorrido antes de fallar

  while (stack.length > 0) {
    const { estadoActual, restanteCadena, recorridoActual } = stack.pop()!;

    // Guardamos el último recorrido válido
    ultimoRecorrido = [...recorridoActual];

    // Si hemos llegado a un estado final y no queda cadena, la cadena es aceptada
    if (estadosFinales.has(estadoActual) && restanteCadena.length === 0) {
      esAceptado = true;
      recorrido.push(...recorridoActual); // Agregar el camino final completo al recorrido
      break;
    }

    // Buscar las transiciones correspondientes al estado actual
    const fila = transitions.find(row => row.state === Number(estadoActual));

    if (fila) {
      // Explorar todas las transiciones del estado actual
      for (const simbolo in fila.transitions) {
        const estadosSiguientes = fila.transitions[simbolo];

        // Verificamos si la transición es por epsilon ('&') o coincide con el siguiente símbolo en la cadena
        if (simbolo === '&' || (restanteCadena.length > 0 && simbolo === restanteCadena[0])) {
          for (const siguienteEstado of estadosSiguientes!) {
            const siguienteEstadoString = siguienteEstado.toString();

            // Crear un nuevo camino con la transición agregada
            const nuevoRecorrido = [...recorridoActual, {
              estadoActual,
              siguienteEstado: siguienteEstadoString,
              simbolo: simbolo === '&' ? '&' : restanteCadena[0]
            }];

            // Si la transición fue por un símbolo (no epsilon), consumimos un símbolo de la cadena
            const siguienteCadena = simbolo === '&' ? restanteCadena : restanteCadena.slice(1);

            // Añadir el nuevo estado y cadena a la pila
            stack.push({
              estadoActual: siguienteEstadoString,
              restanteCadena: siguienteCadena,
              recorridoActual: nuevoRecorrido
            });
          }
        }
      }
    }
  }

  // Si no se aceptó la cadena, devolvemos el último recorrido válido
  if (!esAceptado) {
    recorrido.push(...ultimoRecorrido);
  }
  
  return { recorrido, esAceptado };
}
