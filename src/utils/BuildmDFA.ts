import { State } from "../models/State";

export function buildmDFAFromuDFA(
    dfaTransitions: Map<string, Map<string, string>>, 
    estadosSignificativosMap: Map<string, Set<State>>, 
    estadosFinales: Set<string>
): { nuevasTransicionesAFD: Map<string, Map<string, string>>, nuevosEstadosFinales: Set<string> } {
    
    // Mapa inverso para agrupar los estados del DFA que tienen el mismo conjunto de estados significativos
    const agrupamientoEstados: Map<string, string[]> = new Map(); // { conjuntoSignificativo: [estadosDelDFA] }

    // Convertir el conjunto de estados significativos en una cadena legible para poder comparar los conjuntos
    const convertirConjuntoAString = (conjunto: Set<State>): string => {
        const sortedStates = Array.from(conjunto).map(s => s.id).sort((a, b) => a - b);
        return sortedStates.join(',');
    };

    // Llenar el mapa de agrupamiento
    estadosSignificativosMap.forEach((conjunto, letraDFA) => {
        const conjuntoString = convertirConjuntoAString(conjunto);
        if (!agrupamientoEstados.has(conjuntoString)) {
            agrupamientoEstados.set(conjuntoString, []);
        }
        agrupamientoEstados.get(conjuntoString)!.push(letraDFA);
    });

    // Crear una nueva tabla de transiciones eliminando los duplicados y reemplazando los estados duplicados
    const nuevasTransicionesAFD = new Map<string, Map<string, string>>();
    const nuevosEstadosFinales = new Set<string>();

    agrupamientoEstados.forEach((estados, conjuntoSignificativo) => {
        // Mantenemos solo el primer estado del grupo y eliminamos el resto
        const estadoConservado = estados[0];

        // Añadir las transiciones del estado conservado a las nuevas transiciones
        if (dfaTransitions.has(estadoConservado)) {
            nuevasTransicionesAFD.set(estadoConservado, new Map(dfaTransitions.get(estadoConservado)!));
        }

        // Si el estado conservado estaba en estados finales, lo añadimos al nuevo conjunto de estados finales
        if (estadosFinales.has(estadoConservado)) {
            nuevosEstadosFinales.add(estadoConservado);
        }

        // Recorrer los otros estados duplicados y eliminarlos
        for (let i = 1; i < estados.length; i++) {
            const estadoEliminado = estados[i];

            // Reemplazar en todas las transiciones las referencias al estado eliminado con el estado conservado
            nuevasTransicionesAFD.forEach((transiciones, estadoActual) => {
                transiciones.forEach((destino, simbolo) => {
                    if (destino === estadoEliminado) {
                        transiciones.set(simbolo, estadoConservado);
                    }
                });
            });

            // Si el estado eliminado estaba en las transiciones originales, también hay que eliminarlo
            dfaTransitions.delete(estadoEliminado);

            // Si el estado eliminado estaba en estados finales, eliminarlo de estadosFinales
            estadosFinales.delete(estadoEliminado);
        }
    });

    // Asegurarse de que todas las transiciones apunten a los estados correctos después de la eliminación
    nuevasTransicionesAFD.forEach((transiciones) => {
        transiciones.forEach((destino, simbolo, transicionesMap) => {
            if (!nuevasTransicionesAFD.has(destino)) {
                const estadoRepresentante = agrupamientoEstados.get(convertirConjuntoAString(estadosSignificativosMap.get(destino)!))?.[0];
                if (estadoRepresentante) {
                    transicionesMap.set(simbolo, estadoRepresentante);
                }
            }
        });
    });

    return { nuevasTransicionesAFD, nuevosEstadosFinales };
}
