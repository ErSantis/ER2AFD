import React, { useEffect, useState } from 'react';
import { buildNFAFromRegex } from '../utils/BuildNFA';
import { buildDFAFromNFA } from '../utils/BuildDFA';
import { buildmDFAFromuDFA } from '../utils/BuildmDFA';
import NFATab from './NFATab';
import DFATab from './DFATab';
import { Automaton } from '../models/Automaton';
import { extractSymbolsFromRegxex } from '../utils/extractSymbols';
import { State } from '../models/State';

const AutomatonBuilder: React.FC = () => {
  const [regex, setRegex] = useState<string>(''); // Expresión regular ingresada por el usuario
  const [nfa, setNFA] = useState<Automaton | null>(null); // AFN generado
  const [udfaTransitions, setuDFATransitions] = useState<Map<string, Map<string, string>> | null>(null); // Transiciones del uDFA (AFD no minimizado)
  const [mdfaTransitions, setmDFATransitions] = useState<Map<string, Map<string, string>> | null>(null); // Transiciones del mDFA (AFD minimizado)
  const [symbols, setSymbols] = useState<string[]>([]); // Símbolos del alfabeto
  const [activeTab, setActiveTab] = useState<'NFA' | 'uDFA' | 'DFA'>('NFA'); // Controla la pestaña activa
  const [estadoLetra, setEstadoLetra] = useState<Map<string, Set<State>> | null>(null);
  const [estadosFinales, setEstadosFinales] = useState<Set<string> | null>(null);
  const [estadoInicial, setEstadoInicial] = useState<string | null>(null);
  const [estadosSignificativos, setEstadosSignificativos] = useState<Map<string, Set<State>> | null>(null);
  const [estadosIdenticos, setEstadosIdenticos] = useState<Map<string, string[]> | null>(null);

  // Resetea el automata antes de construir uno nuevo
  const resetAutomata = () => {
    setSymbols([]);
    setNFA(null);
    setuDFATransitions(new Map()); // Limpiar las transiciones uDFA
    setmDFATransitions(new Map()); // Limpiar las transiciones mDFA
    setEstadoLetra(new Map());
    setEstadosFinales(new Set());
    setEstadoInicial(null);
    setEstadosSignificativos(new Map());
    setEstadosIdenticos(new Map());
  };

  // Construye el autómata
  const handleBuildAutomata = () => {
    resetAutomata(); // Limpiar los estados anteriores

    const newSymbols = extractSymbolsFromRegxex(regex);
    setSymbols(newSymbols); // Extraer los símbolos del alfabeto

    const newNFA = buildNFAFromRegex(regex); // Construir el NFA
    setNFA(newNFA);

    if (newNFA) {
      handleuDFA(newNFA, newSymbols); // Construir uDFA si NFA es válido
    }
  };

  // Construye el NFA
  const handleNFA = () => {
    const newNFA = buildNFAFromRegex(regex);
    setNFA(newNFA);
  };

  // Construye el uDFA a partir del NFA
  const handleuDFA = (nfa: Automaton, symbols: string[]) => {
    const { transicionesAFD, conjuntoAFNMap, estadosFinales, estadoInicial, estadosSignificativosMap } = buildDFAFromNFA(nfa, symbols);
    setuDFATransitions(transicionesAFD); // Guardar las transiciones originales del uDFA
    setEstadoLetra(conjuntoAFNMap);
    setEstadosFinales(estadosFinales);
    setEstadoInicial(estadoInicial);
    setEstadosSignificativos(estadosSignificativosMap);
  };

  // Construye el mDFA minimizando el uDFA
  const handlemDFA = () => {
    if (udfaTransitions && estadosSignificativos && estadosFinales) {
      const { nuevasTransicionesAFD, nuevosEstadosFinales, gruposEquivalentes } = buildmDFAFromuDFA(udfaTransitions, estadosSignificativos, estadosFinales);

      setmDFATransitions(nuevasTransicionesAFD); // Guardar las transiciones minimizadas del mDFA
      setEstadosFinales(nuevosEstadosFinales);
      setEstadosIdenticos(gruposEquivalentes);
    }
  };

  // Lógica para cambiar entre pestañas y recalcular los autómatas
  useEffect(() => {
    if (activeTab === 'uDFA' && nfa) {
      handleuDFA(nfa, symbols); // Recalcular el uDFA al cambiar a la pestaña
    } else if (activeTab === 'DFA' && nfa) {
      handlemDFA(); // Minimizar DFA al cambiar de pestaña
    }
  }, [activeTab, nfa, symbols]);

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
      <div>
        {symbols.length > 0 && (
          <p>
            Alfabeto: {symbols.join(', ')}
          </p>
        )}
      </div>

      {/* Pestañas para alternar entre NFA, uDFA y DFA */}
      <div className="tabs">
        <button onClick={() => setActiveTab('NFA')} className={activeTab === 'NFA' ? 'active' : ''}>
          NFA
        </button>
        <button onClick={() => setActiveTab('uDFA')} className={activeTab === 'uDFA' ? 'active' : ''}>
          uDFA
        </button>
        <button onClick={() => setActiveTab('DFA')} className={activeTab === 'DFA' ? 'active' : ''}>
          mDFA
        </button>
      </div>

      {/* Renderizar la pestaña correspondiente */}
      {activeTab === 'NFA' && nfa && (
        <NFATab automaton={nfa} symbols={symbols} />
      )}

      {activeTab === 'uDFA' && udfaTransitions && estadosFinales && estadoLetra && (
        <DFATab
          dfaTransitions={udfaTransitions} // Renderizar las transiciones originales del uDFA
          symbols={symbols}
          estadosFinales={estadosFinales}
          estadoInicial={estadoInicial!}
          conjuntoAFNMap={estadoLetra}
          isMinimized={false} // uDFA
        />
      )}

      {activeTab === 'DFA' && mdfaTransitions && estadosFinales && estadosSignificativos && (
        <DFATab
          dfaTransitions={mdfaTransitions} // Renderizar las transiciones minimizadas del mDFA
          symbols={symbols}
          estadosFinales={estadosFinales}
          estadoInicial={estadoInicial!}
          estadosSignifitivos={estadosSignificativos}
          estadosIdenticos={estadosIdenticos!}
          isMinimized={true} // mDFA
        />
      )}
    </div>
  );
};

export default AutomatonBuilder;
