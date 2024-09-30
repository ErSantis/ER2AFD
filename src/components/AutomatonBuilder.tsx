import React, { useState } from 'react';
import { buildNFAFromRegex } from '../utils/BuildNFA'; // Construcción del AFN
import { buildDFAFromNFA } from '../utils/BuildDFA'; // Conversión del AFN a AFD
import NFATab from './NFATab'; // Componente para el NFA
import DFATab from './DFATab'; // Componente para el DFA
import { Automaton } from '../models/Automaton';

const App: React.FC = () => {
  const [regex, setRegex] = useState<string>(''); // Expresión regular ingresada por el usuario
  const [nfa, setNFA] = useState<Automaton | null>(null); // AFN generado
  const [dfaTransitions,  setDFATransitions] = useState<Map<string, Map<string, string>> | null>(null); // Tabla de transiciones del AFD
  const [symbols, setSymbols] = useState<string[]>([]); // Símbolos del alfabeto
  const [activeTab, setActiveTab] = useState<'NFA' | 'DFA'>('NFA'); // Controla la pestaña activa

  const handleBuildAutomata = () => {
    const { automaton: nfa, alphabet } = buildNFAFromRegex(regex); // Construcción del AFN
    setNFA(nfa); // Actualizar el AFN generado
    setSymbols(Array.from(alphabet)); // Extraer los símbolos del alfabeto

    // Convertir el AFN a AFD usando el método de subconjuntos
    const dfaTransitions = buildDFAFromNFA(nfa, Array.from(alphabet));
    setDFATransitions(dfaTransitions); // Guardar la tabla de transiciones del AFD
  };

  return (
    <div>
      <h1>Automata Finito No Determinista (NFA) y Automata Finito Determinista (DFA)</h1>
      <div>
        <input
          type="text"
          value={regex}
          onChange={(e) => setRegex(e.target.value)}
          placeholder="Enter regular expression"
        />
        <button onClick={handleBuildAutomata}>Build Automata</button>
      </div>

      {/* Pestañas para alternar entre NFA y DFA */}
      <div className="tabs">
        <button onClick={() => setActiveTab('NFA')} className={activeTab === 'NFA' ? 'active' : ''}>
          NFA
        </button>
        <button onClick={() => setActiveTab('DFA')} className={activeTab === 'DFA' ? 'active' : ''}>
          DFA
        </button>
      </div>

      {/* Renderizar la pestaña correspondiente */}
      {activeTab === 'NFA' && nfa && (
        <NFATab automaton={nfa} symbols={symbols} />
      )}

      {activeTab === 'DFA' && dfaTransitions && (
        <DFATab dfaTransitions={dfaTransitions} symbols={symbols} />
      )}
    </div>
  );
};

export default App;
