import { Automaton } from "../models/Automaton";

export interface DynamicAutomatonPros {
    automatonType: 'DFA' | 'NFA',  // Agregamos el tipo de autómata
    automaton?: Automaton,
    dfaTransitions?: Map<string, Map<string, string>>,  // Puede ser NFA o DFA
    symbols: string[],
    estadosFinales?: Set<string>,  // Puede venir o no como prop
    estadoInicial?: string,
    cadena: string
} 