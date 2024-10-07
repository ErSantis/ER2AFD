import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Automaton } from '../models/Automaton';

interface AutomatonContextProps {
    regex: string;
    setRegex: (regex: string) => void;
    nfa: Automaton | null;
    setNFA: (nfa: Automaton | null) => void;
    finalString: string;
    setFinalString: (finalString: string) => void;
    symbols: string[];
    setSymbols: (symbols: string[]) => void;
    activeTab: 'NFA' | 'uDFA' | 'DFA';
    setActiveTab: (tab: 'NFA' | 'uDFA' | 'DFA') => void;
    isButtonEnabled: boolean;
    setIsButtonEnabled: (isEnabled: boolean) => void;
    runSimulation: boolean;
    setRunSimulation: (runSimulation: boolean) => void;
}

const AutomatonContext = createContext<AutomatonContextProps | undefined>(undefined);

export const useAutomatonContext = () => {
    const context = useContext(AutomatonContext);
    if (!context) {
        throw new Error('useAutomatonContext must be used within an AutomatonProvider');
    }
    return context;
};

export const AutomatonProvider = ({ children }: { children: ReactNode }) => {
    const [regex, setRegex] = useState<string>(''); // Expresión regular ingresada por el usuario
    const [nfa, setNFA] = useState<Automaton | null>(null); // AFN generado
    const [finalString, setFinalString] = useState<string>(''); // Estado para guardar el valor cuando se presiona el botón
    const [symbols, setSymbols] = useState<string[]>([]); // Símbolos del alfabeto
    const [activeTab, setActiveTab] = useState<'NFA' | 'uDFA' | 'DFA'>('NFA'); // Controla la pestaña activa
    const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false); // Estado para habilitar o deshabilitar el botón
    const [runSimulation, setRunSimulation] = useState<boolean>(false); // Estado para ejecutar la simulación

    return (
        <AutomatonContext.Provider
            value={{
                regex,
                setRegex,
                nfa,
                setNFA,
                finalString,
                setFinalString,
                symbols,
                setSymbols,
                activeTab,
                setActiveTab,
                isButtonEnabled,
                setIsButtonEnabled,
                runSimulation,
                setRunSimulation
            }}
        >
            {children}
        </AutomatonContext.Provider>
    );
};
