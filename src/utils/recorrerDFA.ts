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
  
    for (let i = 0; i < cadena.length; i++) {
      const simbolo = cadena[i];
      const transiciones = dfaTransitions.get(estadoActual);
  
      if (transiciones) {
        const siguienteEstado = transiciones.get(simbolo);
  
        if (siguienteEstado) {
          recorrido.push({ estadoActual, siguienteEstado, simbolo });
          estadoActual = siguienteEstado;
        } else {
          break; // La cadena no es aceptada
        }
      } else {
        break; // La cadena no es aceptada
      }
    }
  
    // Determinar si el último estado es un estado de aceptación
    const esAceptado = estadosFinales.has(estadoActual);
    return { recorrido, esAceptado };
  }
  