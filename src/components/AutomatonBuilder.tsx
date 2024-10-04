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

  const handleBuildAutomata = () => {
    setSymbols([]);
    setNFA(null);
    setuDFATransitions(null);
    setmDFATransitions(null); // Limpiar el mDFA al reconstruir
    setEstadoLetra(null);
    setEstadosFinales(null);
    setEstadoInicial(null);
    setEstadosSignificativos(null);

    const symbols = extractSymbolsFromRegxex(regex);
    setSymbols(symbols); // Extraer los símbolos del alfabeto

    const nfa = buildNFAFromRegex(regex); // Construcción del AFN
    setNFA(nfa); // Actualizar el AFN generado

    // Convertir el AFN a AFD usando el método de subconjuntos

  };

  useEffect(() => {

    if (nfa) {
      if (activeTab === 'NFA') {
        handleBuildAutomata()

      }
      if (activeTab === 'uDFA') {
        handleuDFA()
      }
      if (activeTab === 'DFA') {
        handlemDFA()
      }
    }
  }, [activeTab])

  const handleuDFA = () => {
    const { transicionesAFD, conjuntoAFNMap, estadosFinales, estadoInicial, estadosSignificativosMap } = buildDFAFromNFA(nfa!, symbols);
    setuDFATransitions(transicionesAFD); // Guardar las transiciones originales del uDFA
    setEstadoLetra(conjuntoAFNMap);
    setEstadosFinales(estadosFinales);
    setEstadoInicial(estadoInicial);
    setEstadosSignificativos(estadosSignificativosMap);
  };

  const handlemDFA = () => {
    if (udfaTransitions && estadosSignificativos && estadosFinales) {
      console.log('Minimizando transiciones...');
      const { nuevasTransicionesAFD, nuevosEstadosFinales } = buildmDFAFromuDFA(udfaTransitions, estadosSignificativos, estadosFinales);

      setuDFATransitions(nuevasTransicionesAFD); // Guardar las transiciones minimizadas del mDFA
      setEstadosFinales(nuevosEstadosFinales);
    } else {
      console.error('One or more required parameters are null');
    }
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
        <button onClick={() => { setActiveTab('uDFA'); handleuDFA(); }} className={activeTab === 'uDFA' ? 'active' : ''}>
          uDFA
        </button>
        <button onClick={() => { setActiveTab('DFA'); handlemDFA(); }} className={activeTab === 'DFA' ? 'active' : ''}>
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
          estadoInicial={estadoInicial || ''}
          conjuntoAFNMap={estadoLetra}
          isMinimized={false} // uDFA
        />
      )}

      {activeTab === 'DFA' && udfaTransitions && estadosFinales && estadosSignificativos && (
        <DFATab
          dfaTransitions={udfaTransitions!} // Renderizar las transiciones minimizadas del mDFA
          symbols={symbols}
          estadosFinales={estadosFinales}
          estadoInicial={estadoInicial || ''}
          conjuntoAFNMap={estadosSignificativos}
          isMinimized={true} // mDFA
        />
      )}
    </div>
  );
};

export default AutomatonBuilder;
