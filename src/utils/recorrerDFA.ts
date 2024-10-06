interface Transicion {
  estadoActual: string;
  siguienteEstado: string;
  simbolo: string;
}

export function recorrerDFA(
  cadena: string,
  dfaTransitions: Map<string, Map<string, string>>,
  estadoInicial: string,
  estadosFinales: Set<string>
): { recorrido: Transicion[], esAceptado: boolean } {
  let estadoActual = estadoInicial;
  const recorrido: Transicion[] = [];

  // Si la cadena es vacía, verificamos si el estado inicial es un estado de aceptación
  if (cadena === "&") {
    const esAceptado = estadosFinales.has(estadoInicial);
    return {
      recorrido: [{ estadoActual: estadoInicial, siguienteEstado: estadoInicial, simbolo: "ε" }],  // Simbolizamos la cadena vacía con "ε"
      esAceptado
    };
  }

  // Iteramos sobre cada símbolo en la cadena
  for (let i = 0; i < cadena.length; i++) {
    const simbolo = cadena[i];
    const transiciones = dfaTransitions.get(estadoActual);



    // Verificamos si existen transiciones para el estado actual
    if (transiciones) {
      const siguienteEstado = transiciones.get(simbolo);

      // Verificamos si hay una transición válida para el símbolo actual
      if (siguienteEstado) {
        recorrido.push({ estadoActual, siguienteEstado, simbolo });
        estadoActual = siguienteEstado;  // Actualizamos el estado actual
      } else {
        // Si no hay transición válida para el símbolo, la cadena es rechazada
        return { recorrido, esAceptado: false };
      }
    } else {
      // Si no hay transiciones desde el estado actual, la cadena es rechazada
      return { recorrido, esAceptado: false };
    }
  }

  // Después de consumir toda la cadena, verificamos si el estado actual es de aceptación
  const esAceptado = estadosFinales.has(estadoActual);

  // Devolvemos el recorrido y si la cadena es aceptada
  return { recorrido, esAceptado };
}
