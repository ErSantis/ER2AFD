import { State } from "./State";

export class Automaton {
  startState: State;
  acceptState: State;

  constructor(startState: State, acceptState: State) {
    this.startState = startState;
    this.acceptState = acceptState;
  }
}