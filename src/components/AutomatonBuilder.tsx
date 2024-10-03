import React, { useState } from 'react';
import { buildNFAFromRegex } from '../utils/BuildNFA';
import { buildDFAFromNFA } from '../utils/BuildDFA';
import { buildmDFAFromuDFA } from '../utils/BuildmDFA';
import NFATab from './NFATab';
import DFATab from './DFATab';
import { Automaton } from '../models/Automaton';
import { extractSymbolsFromRegxex } from '../utils/extractSymbols';
import { State } from '../models/State';

type AutomatonState = {
  nfa: Automaton | null;
  uDfaTransitions: Map<string, Map<string, string>> | null;
  mDfaTransitions: Map<string, Map<string, string>> | null;
  symbols: string[];
  estadoLetra: Map<string, Set<State>> | null;
  estadosFinales: Set<string> | null;
  estadoInicial: string | null;
  estadosSignificativos: Map<string, Set<State>> | null;
};

const initialState: AutomatonState = {
  nfa: null,
  uDfaTransitions: null,
  mDfaTransitions: null,
  symbols: [],
  estadoLetra: null,
  estadosFinales: null,
  estadoInicial: null,
  estadosSignificativos: null,
};

const AutomatonBuilder: React.FC = () => {
  const [regex, setRegex] = useState<string>(''); // Expresión regular ingresada por el usuario
  const [automatonState, setAutomatonState] = useState<AutomatonState>(initialState); // Estado para el autómata
  const [activeTab, setActiveTab] = useState<'NFA' | 'uDFA' | 'DFA'>('NFA'); // Controla la pestaña activa

  const resetAutomata = () => {
    setAutomatonState(initialState);
  };

  const handleBuildAutomata = () => {
    resetAutomata(); // Restablece todo el estado

    const symbols = extractSymbolsFromRegxex(regex);
    const nfa = buildNFAFromRegex(regex);

    // Convertir el AFN a uDFA usando el método de subconjuntos
    const { transicionesAFD, conjuntoAFNMap, estadosFinales, estadoInicial, estadosSignificativosMap } =
      buildDFAFromNFA(nfa, symbols);

    setAutomatonState({
      nfa,
      uDfaTransitions: transicionesAFD,
      mDfaTransitions: null, // Asegúrate de que el DFA minimizado no está establecido aún
      symbols,
      estadoLetra: conjuntoAFNMap,
      estadosFinales,
      estadoInicial,
      estadosSignificativos: estadosSignificativosMap,
    });
  };

  const handlemDFA = () => {
    const { uDfaTransitions, estadosSignificativos, estadosFinales } = automatonState;

    if (uDfaTransitions && estadosSignificativos && estadosFinales) {
      // Generar el DFA minimizado
      const { nuevasTransicionesAFD, nuevosEstadosFinales } = buildmDFAFromuDFA(
        uDfaTransitions,
        estadosSignificativos,
        estadosFinales
      );

      setAutomatonState((prevState) => ({
        ...prevState,
        mDfaTransitions: nuevasTransicionesAFD, // Establecer el DFA minimizado
        estadosFinales: nuevosEstadosFinales,
      }));
    } else {
      console.error('One or more required parameters are null');
    }
  };

  const renderNFA = () => {
    const { nfa, symbols } = automatonState;
    return nfa && <NFATab automaton={nfa} symbols={symbols} />;
  };

  const renderuDFA = () => {
    const { uDfaTransitions, symbols, estadosFinales, estadoInicial, estadoLetra } = automatonState;
    return (
      uDfaTransitions &&
      estadosFinales &&
      estadoLetra && (
        <DFATab
          dfaTransitions={uDfaTransitions}
          symbols={symbols}
          estadosFinales={estadosFinales}
          estadoInicial={estadoInicial || ''}
          conjuntoAFNMap={estadoLetra}
          isMinimized={false} // uDFA original
        />
      )
    );
  };

  const rendermDFA = () => {
    const { mDfaTransitions, symbols, estadosFinales, estadoInicial, estadosSignificativos } = automatonState;
    return (
      mDfaTransitions &&
      estadosFinales &&
      estadosSignificativos && (
        <DFATab
          dfaTransitions={mDfaTransitions}
          symbols={symbols}
          estadosFinales={estadosFinales}
          estadoInicial={estadoInicial || ''}
          conjuntoAFNMap={estadosSignificativos}
          isMinimized={true} // DFA minimizado
        />
      )
    );
  };

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

      {/* Mostrar símbolos únicos */}
      <div>{automatonState.symbols.length > 0 && <p>Alfabeto: {automatonState.symbols.join(', ')}</p>}</div>

      {/* Pestañas para alternar entre NFA, uDFA y DFA */}
      <div className="tabs">
        <button onClick={() => setActiveTab('NFA')} className={activeTab === 'NFA' ? 'active' : ''}>
          NFA
        </button>
        <button onClick={() => setActiveTab('uDFA')} className={activeTab === 'uDFA' ? 'active' : ''}>
          uDFA
        </button>
        <button
          onClick={() => {
            handlemDFA(); // Generar el mDFA antes de cambiar de pestaña
            setActiveTab('DFA');
          }}
          className={activeTab === 'DFA' ? 'active' : ''}
        >
          mDFA
        </button>
      </div>

      {/* Renderizar la pestaña correspondiente */}
      {activeTab === 'NFA' && renderNFA()}
      {activeTab === 'uDFA' && renderuDFA()}
      {activeTab === 'DFA' && rendermDFA()}
    </div>
  );
};

export default AutomatonBuilder;
