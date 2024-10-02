import { Automaton } from "../models/Automaton";

export interface TransitionTableProps {
    automaton: Automaton;
}

// Definir una estructura que asegure que 'state' no se confunda con los símbolos
export interface TransitionRow {
    state: number; // La propiedad state es específica y no se mezcla con los índices dinámicos
    transitions: {
        [symbol: string]: number[] | undefined; // El resto son símbolos dinámicos que representan las transiciones
    };
}