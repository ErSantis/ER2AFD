import { TransitionRow } from "../types/TransitionTable.type";

export function recorrerNFA(
    cadena: string, 
    transitions: TransitionRow[], 
    symbols: string[]
): { recorrido: { estadoActual: string, siguienteEstado: string, simbolo: string }[] } {
    
    const recorrido: { estadoActual: string, siguienteEstado: string, simbolo: string }[] = [];
    
    // Pila para realizar el backtracking y manejar múltiples rutas
    const stack: { estadoActual: string, restanteCadena: string, visitados: Set<string> }[] = [];

    // Iniciamos desde el estado 0
    const estadoInicial = '0';
    stack.push({ estadoActual: estadoInicial, restanteCadena: cadena, visitados: new Set([estadoInicial]) });

    while (stack.length > 0) {
        const { estadoActual, restanteCadena, visitados } = stack.pop()!;

        // Buscar las transiciones correspondientes al estado actual
        const fila = transitions.find(row => row.state === Number(estadoActual));

        if (fila) {
            // Crear un array temporal para las transiciones que hay que explorar después (backtrack)
            const transicionesBacktrack: { estadoActual: string, siguienteEstado: string, simbolo: string, restanteCadena: string }[] = [];

            // Explorar todas las transiciones del estado actual
            for (const simbolo in fila.transitions) {
                const estadosSiguientes = fila.transitions[simbolo];

                // Si la transición es una epsilon (&) o coincide con el símbolo actual, explorarla
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

                            // Guardamos todas las transiciones no exploradas para backtrack
                            transicionesBacktrack.push({
                                estadoActual: siguienteEstadoString,
                                siguienteEstado: siguienteEstadoString,
                                simbolo,
                                restanteCadena: siguienteCadena
                            });
                        }
                    }
                }
            }

            // Exploramos primero la última transición que encontramos (backtracking por orden)
            while (transicionesBacktrack.length > 0) {
                const next = transicionesBacktrack.pop()!;
                stack.push({
                    estadoActual: next.estadoActual,
                    restanteCadena: next.restanteCadena,
                    visitados: new Set(visitados)
                });
            }
        }
    }

    return { recorrido };
}
