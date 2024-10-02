import { State } from "../models/State";

export interface DFATransitionTableProps {
    dfaTransitions: Map<string, Map<string, string>>;
    symbols: string[];
    estadoInicial: string;
    estadosFinales: Set<string>;
    estadosSignificados?: Map<string, Set<State>>
  }
  