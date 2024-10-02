import { State } from "../models/State";

export interface AFNToDFAStateMapProps {
    conjuntoAFNMap: Map<string, Set<State>>;
  }