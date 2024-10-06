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
  const [mdfestadosFinales, setmdfEstadosFinales] = useState<Set<string> | null>(null);
  const [estadoInicial, setEstadoInicial] = useState<string | null>(null);
  const [estadosSignificativos, setEstadosSignificativos] = useState<Map<string, Set<State>> | null>(null);
  const [estadosIdenticos, setEstadosIdenticos] = useState<Map<string, string[]> | null>(null);

  const [isButtonEnabled, setIsButtonEnabled] = useState(false); // Estado para habilitar o deshabilitar el botón

  const [inputString, setInputString] = useState(''); // Estado para controlar el input
  const [finalString, setFinalString] = useState(''); // Estado para guardar el valor cuando se presiona el botón

  // Resetea el automata antes de construir uno nuevo
  const resetAutomata = () => {

    setSymbols([]);
    setNFA(null);
    setFinalString('')
    setuDFATransitions(new Map()); // Limpiar las transiciones uDFA
    setmDFATransitions(new Map()); // Limpiar las transiciones mDFA
    setEstadoLetra(new Map());
    setEstadosFinales(new Set());
    setmdfEstadosFinales(new Set());
    setEstadoInicial(null);
    setEstadosSignificativos(new Map());
    setEstadosIdenticos(new Map());
  };

  // Valida el input para construir el automata
  // Manejar cambio del input de regex
  const handleRegexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRegex(value); // Actualiza el estado del regex
  };

  // Validar el regex cada vez que el valor cambie
  useEffect(() => {
    validateRegex(regex); // Llama a la función de validación cada vez que regex cambie
  }, [regex]);

  // Función de validación
  const validateRegex = (input: string) => {
    const isValid = input.length % 2 === 0; // Lógica de validación
    setIsButtonEnabled(isValid); // Actualiza el estado del botón
  };

  // Construye el autómata
  const handleBuildAutomata = () => {
    resetAutomata(); // Limpiar los estados anteriores

    setSymbols(extractSymbolsFromRegxex(regex)); // Extraer los símbolos del alfabeto

    setNFA(buildNFAFromRegex(regex)); //Contruir el NFA

    if (nfa) {
      handleuDFA(nfa, symbols) // Construir el uDFA
      handlemDFA() // Contruti el mDFA
    }

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
      setmdfEstadosFinales(nuevosEstadosFinales);
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
    setFinalString('')

  }, [activeTab, nfa, regex]);


  const handleInputChange = (e) => {
    setInputString(e.target.value); // Actualiza el valor del input mientras escribes
  };

  const handleSubmit = () => {
    setFinalString(''); // Resetea la cadena final para asegurarte de que siempre haya un cambio de estado
    setTimeout(() => setFinalString(inputString), 0); // Establece la cadena final nuevamente con un pequeño retraso
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
        <button
          onClick={() => { handleBuildAutomata(), setActiveTab('NFA') }}
          disabled={!isButtonEnabled} // Controla si el botón está habilitado o deshabilitad
        >
          Build Automata
        </button>
        <input
          type="text"
          value={inputString}
          onChange={(e) => handleInputChange(e)}
          placeholder="Enter string"
        />
        <button onClick={handleSubmit}>Test</button>
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
        <NFATab automaton={nfa} symbols={symbols} cadena={finalString} />
      )}

      {activeTab === 'uDFA' && udfaTransitions && estadoInicial && estadosFinales && estadoLetra && (
        <DFATab
          dfaTransitions={udfaTransitions} // Renderizar las transiciones originales del uDFA
          symbols={symbols}
          estadosFinales={estadosFinales}
          estadoInicial={estadoInicial}
          conjuntoAFNMap={estadoLetra}
          cadena={finalString}
          isMinimized={false} // uDFA
        />
      )}

      {activeTab === 'DFA' && mdfaTransitions && mdfestadosFinales && estadosSignificativos && estadoInicial && estadosIdenticos && (
        <DFATab
          dfaTransitions={mdfaTransitions} // Renderizar las transiciones minimizadas del mDFA
          symbols={symbols}
          estadosFinales={mdfestadosFinales}
          estadoInicial={estadoInicial}
          estadosSignifitivos={estadosSignificativos}
          estadosIdenticos={estadosIdenticos}
          cadena={finalString}
          isMinimized={true} // mDFA
        />
      )}
    </div>
  );
};

export default AutomatonBuilder;
