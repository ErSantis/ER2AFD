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
  const stack: { estadoActual: string, restanteCadena: string, visitados: Set<string>, transicionesPendientes: any[] }[] = [];

  // Iniciamos desde el estado inicial
  stack.push({ 
    estadoActual: estadoInicial, 
    restanteCadena: cadena, 
    visitados: new Set([estadoInicial]), 
    transicionesPendientes: [] 
  });

  while (stack.length > 0) {
    const { estadoActual, restanteCadena, visitados, transicionesPendientes } = stack.pop()!;

    // Si el estado actual es un estado final, terminamos el recorrido
    if (estadosFinales.has(estadoActual) && restanteCadena.length === 0) {
      esAceptado = true;
      break;
    }

    // Buscar las transiciones correspondientes al estado actual
    const fila = transitions.find(row => row.state === Number(estadoActual));

    if (fila) {
      const nuevasTransicionesPendientes: { estadoActual: string, siguienteEstado: string, simbolo: string, restanteCadena: string }[] = [];

      // Explorar todas las transiciones del estado actual
      for (const simbolo in fila.transitions) {
        const estadosSiguientes = fila.transitions[simbolo];

        if (simbolo === '&' || (restanteCadena.length > 0 && simbolo === restanteCadena[0])) {
          for (const siguienteEstado of estadosSiguientes!) {
            const siguienteEstadoString = siguienteEstado.toString();

            // Evitar ciclos infinitos revisando si ya hemos visitado este estado
            if (!visitados.has(siguienteEstadoString)) {
              const nuevosVisitados = new Set(visitados);
              nuevosVisitados.add(siguienteEstadoString);

              // Añadir al recorrido
              recorrido.push({
                estadoActual,
                siguienteEstado: siguienteEstadoString,
                simbolo: simbolo === '&' ? '&' : restanteCadena[0]
              });

              // Si la transición fue por un símbolo (no epsilon), consumimos un símbolo de la cadena
              const siguienteCadena = simbolo === '&' ? restanteCadena : restanteCadena.slice(1);

              // Si hay más de una opción, las opciones no exploradas se empujan a las pendientes
              nuevasTransicionesPendientes.push({
                estadoActual: siguienteEstadoString,
                siguienteEstado: siguienteEstadoString,
                simbolo,
                restanteCadena: siguienteCadena
              });
            }
          }
        }
      }

      // Si hay transiciones pendientes no exploradas, las guardamos para explorarlas después
      while (nuevasTransicionesPendientes.length > 0) {
        const siguienteTransicion = nuevasTransicionesPendientes.pop()!;
        stack.push({
          estadoActual: siguienteTransicion.siguienteEstado,
          restanteCadena: siguienteTransicion.restanteCadena,
          visitados: new Set(visitados),
          transicionesPendientes: nuevasTransicionesPendientes
        });
      }
    }
  }
  console.log(recorrido, esAceptado)
  return { recorrido, esAceptado };
}
