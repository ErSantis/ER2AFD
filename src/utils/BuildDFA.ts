import { cerraduraE } from './cerraduraE';
import { Automaton } from '../models/Automaton';
import { State } from '../models/State';
import { mueve } from './mueve';

// Función para convertir un AFN a AFD utilizando el método de subconjuntos y etiquetando los estados con letras
export function buildDFAFromNFA(afn: Automaton, symbols: string[]): Map<string, Map<string, string>> {
    // Inicialización
    const estadosD: Set<Set<State>> = new Set();  // Conjunto de estados del AFD
    const transicionesAFD = new Map<string, Map<string, string>>(); // Tabla de transiciones del AFD
    const noMarcados: Set<State>[] = []; // Lista de estados no marcados
    const cerraduraInicial = cerraduraE(afn.startState);  // Cerradura épsilon del estado inicial

    let letraCounter = 0; // Contador para asignar letras a los conjuntos de estados
    const estadoLetraMap = new Map<string, string>(); // Mapa para asociar conjuntos de estados con letras

    const obtenerSiguienteLetra = (): string => {
        return String.fromCharCode(65 + letraCounter++); // Devuelve 'A', 'B', 'C', ...
    };

    // Generar el nombre de la letra para el conjunto
    const generarNombreConjunto = (conjunto: Set<State>): string => {
        const nombreConjunto = obtenerNombreConjunto(conjunto); // Nombre basado en IDs numéricos
        if (!estadoLetraMap.has(nombreConjunto)) {
            estadoLetraMap.set(nombreConjunto, obtenerSiguienteLetra());
        }
        return estadoLetraMap.get(nombreConjunto)!; // Retorna la letra asociada al conjunto
    };

    estadosD.add(cerraduraInicial); // Añadir la cerradura inicial a estadosD
    noMarcados.push(cerraduraInicial); // Marcar la cerradura inicial como no marcada

    // Mientras haya un conjunto de estados no marcado
    while (noMarcados.length > 0) {
        const T = noMarcados.pop()!; // Obtener un conjunto no marcado y marcarlo
        const nombreEstadoT = generarNombreConjunto(T); // Convertir el conjunto a una letra

        // Crear una nueva entrada en la tabla de transiciones
        if (!transicionesAFD.has(nombreEstadoT)) {
            transicionesAFD.set(nombreEstadoT, new Map<string, string>());
        }

        // Para cada símbolo en el alfabeto
        for (const symbol of symbols) {
            const U = new Set<State>();

            // Mover a través del símbolo
            T.forEach(state => {
                const moverStates = mueve(state, symbol);
                moverStates.forEach(s => U.add(s));
            });

            // Obtener la cerradura épsilon de U
            const cerraduraU = new Set<State>();
            U.forEach(state => {
                const cerraduraDeU = cerraduraE(state);
                cerraduraDeU.forEach(s => cerraduraU.add(s));
            });

            // Si U no está en estadosD, añadir U como estado no marcado
            if (cerraduraU.size > 0 && !conjuntoYaExiste(estadosD, cerraduraU)) {
                estadosD.add(cerraduraU);
                noMarcados.push(cerraduraU);
            }

            // Añadir la transición a la tabla de transiciones
            if (cerraduraU.size > 0) {
                const nombreEstadoU = generarNombreConjunto(cerraduraU);
                transicionesAFD.get(nombreEstadoT)!.set(symbol, nombreEstadoU);
            }
        }
    }

    return transicionesAFD;
}

// Función auxiliar para generar un nombre para un conjunto de estados
function obtenerNombreConjunto(conjunto: Set<State>): string {
    const sortedStates = Array.from(conjunto).map(s => s.id).sort((a, b) => a - b);
    return `{${sortedStates.join(',')}}`;
}

// Función auxiliar para verificar si un conjunto ya existe en estadosD
function conjuntoYaExiste(estadosD: Set<Set<State>>, conjunto: Set<State>): boolean {
    for (const estado of estadosD) {
        if (conjuntosIguales(estado, conjunto)) {
            return true;
        }
    }
    return false;
}

// Función auxiliar para comparar dos conjuntos de estados
function conjuntosIguales(conjunto1: Set<State>, conjunto2: Set<State>): boolean {
    if (conjunto1.size !== conjunto2.size) {
        return false;
    }

    for (const state of conjunto1) {
        if (!conjunto2.has(state)) {
            return false;
        }
    }

    return true;
}
