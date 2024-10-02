import React, { useState } from 'react';
import { buildNFAFromRegex } from '../utils/BuildNFA'; // Construcción del AFN
import { buildDFAFromNFA } from '../utils/BuildDFA'; // Conversión del AFN a AFD
import { buildmDFAFromuDFA } from '../utils/BuildmDFA';
import NFATab from './NFATab'; // Componente para el NFA
import DFATab from './DFATab'; // Componente para el DFA
import { Automaton } from '../models/Automaton';
import { State } from '../models/State';

const App: React.FC = () => {
  const [regex, setRegex] = useState<string>(''); // Expresión regular ingresada por el usuario
  const [nfa, setNFA] = useState<Automaton | null>(null); // AFN generado
  const [dfaTransitions, setDFATransitions] = useState<Map<string, Map<string, string>> | null>(null); // Tabla de transiciones del AFD
  const [symbols, setSymbols] = useState<string[]>([]); // Símbolos del alfabeto
  const [activeTab, setActiveTab] = useState<'NFA' | 'uDFA' | 'DFA'>('NFA'); // Controla la pestaña activa
  const [estadoLetra, setEstadoLetra] = useState<Map<string, Set<State>> | null>(null)
  const [estadosFinales, setEstadosFinales] = useState<Set<string> | null>(null)
  const [estadoInicial, setEstadoInicial] = useState<string | null>(null)
  const [estadosSignificativos, setEstadosSignificativos] = useState<Map<string, Set<State>> | null>(null)
  const extractSymbols = (regex: string): string[] => {
    const alphabet = new Set<string>();
    for (let i = 0; i < regex.length; i++) {
      const char = regex[i];
      if (char !== '(' && char !== ')' && char !== '|' && char !== '*' && char !== '+' && char !== '?') {
        alphabet.add(char);
      }
    }
    return Array.from(alphabet);
  };

  const handleBuildAutomata = () => {

    setSymbols([])
    setNFA(null)
    setDFATransitions(null)
    setEstadoLetra(null)
    setEstadosFinales(null)
    setEstadoInicial(null)
    setEstadosSignificativos(null)


    const symbols = extractSymbols(regex);
    setSymbols(extractSymbols(regex)); // Extraer los símbolos del alfabeto

    const nfa = buildNFAFromRegex(regex); // Construcción del AFN
    setNFA(nfa); // Actualizar el AFN generado



    // Convertir el AFN a AFD usando el método de subconjuntos
    const { transicionesAFD, conjuntoAFNMap, estadosFinales, estadoInicial, estadosSignificativosMap } = buildDFAFromNFA(nfa, symbols);

    setDFATransitions(transicionesAFD);
    setEstadoLetra(conjuntoAFNMap);
    setEstadosFinales(estadosFinales);
    setEstadoInicial(estadoInicial);
    setEstadosSignificativos(estadosSignificativosMap);
    
    console.log("Initial", dfaTransitions)
  };

  const handlemDFA = () => {
    if (dfaTransitions && estadosSignificativos && estadosFinales) {

      const { nuevasTransicionesAFD, nuevosEstadosFinales } = buildmDFAFromuDFA(dfaTransitions, estadosSignificativos, estadosFinales);

      setDFATransitions(nuevasTransicionesAFD);
      setEstadosFinales(nuevosEstadosFinales);
    } else {
      console.error("One or more required parameters are null");
    }
  }

  return (
    <div>
      <h1>ER2mAFD</h1>
      <div>
        <input
          type="text"
          value={regex}
          onChange={(e) => setRegex(e.target.value)}
          placeholder="Enter regular expression"
        />
        <button onClick={handleBuildAutomata}>Build Automata</button>
      </div>

      {/*Mostrar simbolos unicos */}
      <div>
        {symbols.length > 0 && (
          <p>
            Alfabeto: {symbols.join(', ')}
          </p>
        )}
      </div>

      {/* Pestañas para alternar entre NFA y DFA */}
      <div className="tabs">
        <button onClick={() => setActiveTab('NFA')} className={activeTab === 'NFA' ? 'active' : ''}>
          NFA
        </button>
        <button onClick={() => setActiveTab('uDFA')} className={activeTab === 'uDFA' ? 'active' : ''}>
          uDFA
        </button>
        <button onClick={() => { setActiveTab('DFA'); handlemDFA() }} className={activeTab === 'DFA' ? 'active' : ''}>
          DFA
        </button>
      </div>

      {/* Renderizar la pestaña correspondiente */}
      {activeTab === 'NFA' && nfa && (
        <NFATab automaton={nfa} symbols={symbols} />
      )}

      {activeTab === 'uDFA' && dfaTransitions && estadosFinales && estadoLetra && (
        <DFATab dfaTransitions={dfaTransitions} symbols={symbols} estadosFinales={estadosFinales} estadoInicial={estadoInicial || ''} conjuntoAFNMap={estadoLetra} />
      )}

      {activeTab === 'DFA' && dfaTransitions && estadosFinales && estadoLetra && estadosSignificativos && (
        <DFATab dfaTransitions={dfaTransitions} symbols={symbols} estadosFinales={estadosFinales} estadoInicial={estadoInicial || ''} conjuntoAFNMap={estadosSignificativos} />
      )}

    </div>
  );
};

export default App;
