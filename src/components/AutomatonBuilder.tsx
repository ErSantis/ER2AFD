import React, { useState } from "react";
import { buildNFAFromRegex } from '../utils/Thompson';
import { visualizeNFA } from '../utils/visualizeAFN';

const AutomataBuilder: React.FC = () => {
  const [regex, setRegex] = useState<string>("");
  const [transitions, setTransitions] = useState<string[]>([]);

  const handleBuildAutomaton = () => {
    const nfa = buildNFAFromRegex(regex);
    const transitionList = visualizeNFA(nfa);
    setTransitions(transitionList);
  };

  return (
    <div>
      <h2>Automaton Builder</h2>
      <input
        type="text"
        value={regex}
        onChange={(e) => setRegex(e.target.value)}
        placeholder="Enter Regular Expression"
      />
      <button onClick={handleBuildAutomaton}>Build NFA</button>
      <h3>Transitions:</h3>
      <ul>
        {transitions.map((t, index) => (
          <li key={index}>{t}</li>
        ))}
      </ul>
    </div>
  );
};

export default AutomataBuilder;
