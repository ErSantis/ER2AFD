import { State } from "../models/State";

export interface DFATabProps {
    dfaTransitions: Map<string, Map<string, string>>;
    symbols: string[];
    estadosFinales: Set<string>;
    estadoInicial: string;
    conjuntoAFNMap:  Map<string, Set<State>>
    estadoSignificativos?:  Map<string, Set<State>>
  }
  