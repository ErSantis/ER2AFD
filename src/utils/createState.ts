import { State } from "../models/State";

let stateCounter = 0;

export function createState(): State {
  return new State(stateCounter++);
}
