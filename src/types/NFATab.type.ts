import { Automaton } from "../models/Automaton";

export interface NFATabProps {
    automaton: Automaton;
    symbols: string[];
    cadena: string;
  }
  