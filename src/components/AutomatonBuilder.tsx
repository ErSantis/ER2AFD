import React, { useEffect, useState } from "react";
import { buildNFAFromRegex } from "../utils/BuildNFA";
import { buildDFAFromNFA } from "../utils/BuildDFA";
import { buildmDFAFromuDFA } from "../utils/BuildmDFA";
import NFATab from "./NFATab";
import DFATab from "./DFATab";
import { Automaton } from "../models/Automaton";
import { extractSymbolsFromRegxex } from "../utils/extractSymbols";
import { State } from "../models/State";

const AutomatonBuilder: React.FC = () => {
  const [regex, setRegex] = useState<string>(""); // Expresión regular ingresada por el usuario
  const [nfa, setNFA] = useState<Automaton | null>(null); // AFN generado
  const [udfaTransitions, setuDFATransitions] = useState<Map<
    string,
    Map<string, string>
  > | null>(null); // Transiciones del uDFA (AFD no minimizado)
  const [mdfaTransitions, setmDFATransitions] = useState<Map<
    string,
    Map<string, string>
  > | null>(null); // Transiciones del mDFA (AFD minimizado)
  const [symbols, setSymbols] = useState<string[]>([]); // Símbolos del alfabeto
  const [activeTab, setActiveTab] = useState<"NFA" | "uDFA" | "DFA">("NFA"); // Controla la pestaña activa
  const [estadoLetra, setEstadoLetra] = useState<Map<
    string,
    Set<State>
  > | null>(null);
  const [estadosFinales, setEstadosFinales] = useState<Set<string> | null>(
    null
  );
  const [mdfestadosFinales, setmdfEstadosFinales] =
    useState<Set<string> | null>(null);
  const [estadoInicial, setEstadoInicial] = useState<string | null>(null);
  const [estadosSignificativos, setEstadosSignificativos] = useState<Map<
    string,
    Set<State>
  > | null>(null);
  const [estadosIdenticos, setEstadosIdenticos] = useState<Map<
    string,
    string[]
  > | null>(null);

  const [inputString, setInputString] = useState(""); // Estado para controlar el input
  const [finalString, setFinalString] = useState(""); // Estado para guardar el valor cuando se presiona el botón

  // Resetea el automata antes de construir uno nuevo
  const resetAutomata = () => {
    setSymbols([]);
    setNFA(null);
    setFinalString("");
    setuDFATransitions(new Map()); // Limpiar las transiciones uDFA
    setmDFATransitions(new Map()); // Limpiar las transiciones mDFA
    setEstadoLetra(new Map());
    setEstadosFinales(new Set());
    setmdfEstadosFinales(new Set());
    setEstadoInicial(null);
    setEstadosSignificativos(new Map());
    setEstadosIdenticos(new Map());
  };

  // Construye el autómata
  const handleBuildAutomata = () => {
    resetAutomata(); // Limpiar los estados anteriores

    setSymbols(extractSymbolsFromRegxex(regex)); // Extraer los símbolos del alfabeto

    setNFA(buildNFAFromRegex(regex)); //Contruir el NFA

    if (nfa) {
      handleuDFA(nfa, symbols); // Construir el uDFA
      handlemDFA(); // Contruti el mDFA
    }
  };

  // Construye el uDFA a partir del NFA
  const handleuDFA = (nfa: Automaton, symbols: string[]) => {
    const {
      transicionesAFD,
      conjuntoAFNMap,
      estadosFinales,
      estadoInicial,
      estadosSignificativosMap,
    } = buildDFAFromNFA(nfa, symbols);

    setuDFATransitions(transicionesAFD); // Guardar las transiciones originales del uDFA
    setEstadoLetra(conjuntoAFNMap);
    setEstadosFinales(estadosFinales);
    setEstadoInicial(estadoInicial);
    setEstadosSignificativos(estadosSignificativosMap);
  };

  // Construye el mDFA minimizando el uDFA
  const handlemDFA = () => {
    if (udfaTransitions && estadosSignificativos && estadosFinales) {
      const {
        nuevasTransicionesAFD,
        nuevosEstadosFinales,
        gruposEquivalentes,
      } = buildmDFAFromuDFA(
        udfaTransitions,
        estadosSignificativos,
        estadosFinales
      );

      setmDFATransitions(nuevasTransicionesAFD); // Guardar las transiciones minimizadas del mDFA
      setmdfEstadosFinales(nuevosEstadosFinales);
      setEstadosIdenticos(gruposEquivalentes);
    }
  };

  // Lógica para cambiar entre pestañas y recalcular los autómatas
  useEffect(() => {
    if (activeTab === "uDFA" && nfa) {
      handleuDFA(nfa, symbols); // Recalcular el uDFA al cambiar a la pestaña
    } else if (activeTab === "DFA" && nfa) {
      handlemDFA(); // Minimizar DFA al cambiar de pestaña
    }
    setFinalString("");
  }, [activeTab, nfa, regex]);

  const handleInputChange = (e) => {
    setInputString(e.target.value); // Actualiza el valor del input mientras escribes
  };

  const handleSubmit = () => {
    setFinalString(""); // Resetea la cadena final para asegurarte de que siempre haya un cambio de estado
    setTimeout(() => setFinalString(inputString), 0); // Establece la cadena final nuevamente con un pequeño retraso
  };

  const headerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    backgroundColor: "#405c89",
    padding: "20px",
    zIndex: 1000,
    boxSizing: "border-box",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.7)",
    borderBottomLeftRadius: "15px",
    borderBottomRightRadius: "15px",
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const logoStyle: React.CSSProperties = {
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    border: "2px solid white",
    marginBottom: "10px",
  };

  const buttonsContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "15px",
    marginBottom: "15px",
  };

  const inputContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "100%",
    maxWidth: "600px",
  };

  const inputStyle: React.CSSProperties = {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "calc(100% - 10px)",
    boxSizing: "border-box",
    backgroundColor: "#f9f9f9",
    color: "black",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "9px",
    borderRadius: "5px",
    backgroundColor: "#405c89",
    color: "white",
    cursor: "pointer",
    border: "2px solid #f9f9f9",
    width: "30%",
  };

  return (
    <div>
      <header style={headerStyle}>
        <div style={containerStyle}>
          <a href="/">
            <img style={logoStyle} src="./logo.png" alt="Logo" />
          </a>
          <div style={buttonsContainerStyle}>
            <button
              onClick={() => setActiveTab("NFA")}
              className={activeTab === "NFA" ? "active" : ""}
              style={buttonStyle}
            >
              NFA
            </button>
            <button
              onClick={() => setActiveTab("uDFA")}
              className={activeTab === "uDFA" ? "active" : ""}
              style={buttonStyle}
            >
              uDFA
            </button>
            <button
              onClick={() => setActiveTab("DFA")}
              className={activeTab === "DFA" ? "active" : ""}
              style={buttonStyle}
            >
              mDFA
            </button>
          </div>

          <div style={inputContainerStyle}>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={regex}
                onChange={(e) => setRegex(e.target.value)}
                placeholder="Enter regular expression"
                style={inputStyle}
              />
              <button
                onClick={() => {
                  handleBuildAutomata();
                  setActiveTab("NFA");
                }}
                style={buttonStyle}
              >
                Build Automata
              </button>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={inputString}
                onChange={(e) => handleInputChange(e)}
                placeholder="Enter string"
                style={inputStyle}
              />
              <button onClick={handleSubmit} style={buttonStyle}>
                Test
              </button>
            </div>
          </div>
        </div>
      </header>

      <div style={{ marginTop: "180px" }}>
        {symbols.length > 0 && <p>Alfabeto: {symbols.join(", ")}</p>}
      </div>

      {activeTab === "NFA" && nfa && (
        <NFATab automaton={nfa} symbols={symbols} cadena={finalString} />
      )}
      {activeTab === "uDFA" &&
        udfaTransitions &&
        estadoInicial &&
        estadosFinales &&
        estadoLetra && (
          <DFATab
            dfaTransitions={udfaTransitions}
            symbols={symbols}
            estadosFinales={estadosFinales}
            estadoInicial={estadoInicial}
            conjuntoAFNMap={estadoLetra}
            cadena={finalString}
            isMinimized={false} // uDFA
          />
        )}
      {activeTab === "DFA" &&
        mdfaTransitions &&
        mdfestadosFinales &&
        estadosSignificativos &&
        estadoInicial &&
        estadosIdenticos && (
          <DFATab
            dfaTransitions={mdfaTransitions}
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
