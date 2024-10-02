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

    // Crear una nueva tabla de transiciones eliminando los duplicados
    const nuevasTransicionesAFD = new Map<string, Map<string, string>>();
    const nuevosEstadosFinales = new Set<string>();

    agrupamientoEstados.forEach((estados, conjuntoSignificativo) => {
        // Mantenemos solo el primer estado del grupo y eliminamos el resto
        const estadoConservado = estados[0];
        // Añadir las transiciones del estado conservado a las nuevas transiciones
        if (dfaTransitions.has(estadoConservado)) {
            nuevasTransicionesAFD.set(estadoConservado, dfaTransitions.get(estadoConservado)!);
        }

        // Si el estado conservado estaba en estados finales, lo añadimos al nuevo conjunto de estados finales
        if (estadosFinales.has(estadoConservado)) {
            nuevosEstadosFinales.add(estadoConservado);
        }

        // Eliminar los estados duplicados
        for (let i = 1; i < estados.length; i++) {
            const estadoEliminado = estados[i];
            dfaTransitions.delete(estadoEliminado); // Eliminar el estado duplicado
            console.log("He eliminado", estadoEliminado);
            

            // Si el estado eliminado estaba en estados finales, lo eliminamos también de estadosFinales
            if (estadosFinales.has(estadoEliminado)) {
                estadosFinales.delete(estadoEliminado);
            }
        }
    });

    console.log(nuevasTransicionesAFD)
    return { nuevasTransicionesAFD: nuevasTransicionesAFD, nuevosEstadosFinales: nuevosEstadosFinales };
}
