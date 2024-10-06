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
  const [estadoLetra, setEstadoLetra] = useState<Map<string, Set<State>> | null>(null); // Relacion entre el estado DFA - conjunto AFN
  const [estadosFinales, setEstadosFinales] = useState<Set<string> | null>(null); // Estados finales deL UDFA
  const [mdfestadosFinales, setmdfEstadosFinales] = useState<Set<string> | null>(null);// Estados Finlaes del mDFA
  const [estadoInicial, setEstadoInicial] = useState<string | null>(null); // Estado Inicial de los DFA
  const [estadosSignificativos, setEstadosSignificativos] = useState<Map<string, Set<State>> | null>(null); // Estados significativos del AFN
  const [estadosIdenticos, setEstadosIdenticos] = useState<Map<string, string[]> | null>(null); //Estados que se identifican(Mimso conjunto de estados significativos)

  const [isButtonEnabled, setIsButtonEnabled] = useState(false); // Estado para habilitar o deshabilitar el botón

  const [inputString, setInputString] = useState(''); // Estado para controlar el input
  const [finalString, setFinalString] = useState(''); // Estado para guardar el valor cuando se presiona el botón

  const [runSimulation, SetRunSimulation] = useState<boolean>(false)


  const resetAutomata = () => {

    setSymbols([]); // Resetea los símbolos a un array vacío
    setNFA(null); // Resetea el NFA (Non-deterministic Finite Automaton) a null
    setFinalString(''); // Resetea la cadena final a una cadena vacía
    setuDFATransitions(new Map()); // Limpia las transiciones uDFA (unminimized Deterministic Finite Automaton)
    setmDFATransitions(new Map()); // Limpia las transiciones mDFA (minimized Deterministic Finite Automaton)
    setEstadoLetra(new Map()); // Resetea el estado de las letras a un nuevo Map vacío
    setEstadosFinales(new Set()); // Resetea los estados finales a un nuevo Set vacío
    setmdfEstadosFinales(new Set()); // Resetea los estados finales minimizados a un nuevo Set vacío
    setEstadoInicial(null); // Resetea el estado inicial a null
    setEstadosSignificativos(new Map()); // Resetea los estados significativos a un nuevo Map vacío
    setEstadosIdenticos(new Map()); // Resetea los estados idénticos a un nuevo Map vacío

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
    // Si el input está vacío, deshabilitamos el botón
    if (input.trim() === '') {
        setIsButtonEnabled(false);
        return;
    }

    // Validar que empiece con algo válido (un carácter o una expresión entre paréntesis)
    const validStartRegex = /^([^)\\|*?+]+.*)$/;
    if (!validStartRegex.test(input)) {
        setIsButtonEnabled(false);
        return;
    }

    // Validar que no contenga caracteres reservados
    // const hasReservedCharacters = /[\\\"]/;
    // if (hasReservedCharacters.test(input)) {
    //     setIsButtonEnabled(false);
    //     return;
    // }

    // Validar que no se repitan más de una vez los caracteres ?, +, y *
    const invalidRepeatRegex = /(\?|\+|\*)(\?|\+|\*)+/;
    if (invalidRepeatRegex.test(input)) {
        setIsButtonEnabled(false);
        return;
    }

    // Validar que los | tengan algo a ambos lados
    const arePipesValid = (input: string): boolean => {
      // Asegurarse de que no haya pipes consecutivos sin nada válido entre ellos
      const invalidPipesRegex = /\|\||\(\||\|\)|\|[*+?)]|(?<!\()\|(?=\))/;
  
      // Retorna true si no hay casos de pipes inválidos
      return !invalidPipesRegex.test(input);
    };
  
    // Si el input contiene un pipe y no pasa la validación de pipes, desactiva el botón
    if (input.includes("|") && !arePipesValid(input)) {
      setIsButtonEnabled(false);
      return;
    }

    // Validar que los parentesis no esten vacios
    const hasEmptyParentheses = (input: string): boolean => {
      const emptyParenthesesRegex = /\(\)|\([*+?|]\)/;
      return emptyParenthesesRegex.test(input);
    };
    if (hasEmptyParentheses(input)) {
      setIsButtonEnabled(false);
      return;
    }
  

    // Validar que los paréntesis estén balanceados
    const areParenthesesBalanced = (str: string): boolean => {
        let stack: string[] = [];
        for (let char of str) {
            if (char === '(') {
                stack.push(char);
            } else if (char === ')') {
                if (stack.length === 0) {
                    return false;
                }
                stack.pop();
            }
        }
        return stack.length === 0;
    };

    if (!areParenthesesBalanced(input)) {
        setIsButtonEnabled(false);
        return;
    }
    setIsButtonEnabled(true);
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
    setEstadoLetra(conjuntoAFNMap); // Establecer el estado de las letras con el conjunto AFN
    setEstadosFinales(estadosFinales); // Establecer los estados finales
    setEstadoInicial(estadoInicial); // Establecer el estado inicial
    setEstadosSignificativos(estadosSignificativosMap); // Establecer los estados significativos con el Map correspondiente

  };

  // Construye el mDFA minimizando el uDFA
  const handlemDFA = () => {
    if (udfaTransitions && estadosSignificativos && estadosFinales) {
      const { nuevasTransicionesAFD, nuevosEstadosFinales, gruposEquivalentes } = buildmDFAFromuDFA(udfaTransitions, estadosSignificativos, estadosFinales);

      setmDFATransitions(nuevasTransicionesAFD); // Guardar las transiciones minimizadas del mDFA
      setmdfEstadosFinales(nuevosEstadosFinales); // Establecer los nuevos estados finales minimizados
      setEstadosIdenticos(gruposEquivalentes); // Establecer los grupos de estados equivalentes

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
