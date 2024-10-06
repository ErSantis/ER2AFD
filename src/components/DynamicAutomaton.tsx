import React, { useState, useEffect } from 'react';
import AutomatonGraph from './AutomatonGraph';
import { dfaToDot, nfaToDot } from '../utils/AutomatonToDot';
import { recorrerDFA } from '../utils/recorrerDFA';
import { recorrerNFA } from '../utils/recorrerNFA';
import { generateTable } from '../utils/generateTable';
import { DynamicAutomatonPros } from '../types/DynamicAutomaton.type';
import '../styles/DynamicAutomaton.css'

const DynamicAutomaton: React.FC<DynamicAutomatonPros> = ({ automatonType, automaton, dfaTransitions, symbols, estadosFinales, estadoInicial, cadena }) => {
    const [recorrido, setRecorrido] = useState<{ estadoActual: string, siguienteEstado: string, simbolo: string }[]>([]);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [estadoResaltado, setEstadoResaltado] = useState<string | null>(null);
    const [transicionResaltada, setTransicionResaltada] = useState<{ estadoActual: string, siguienteEstado: string, simbolo: string } | null>(null);
    const [estadoFinalAlcanzado, setEstadoFinalAlcanzado] = useState<string | null>(null);
    const [resetColors, setResetColors] = useState<boolean>(false); 
    const [esAceptado, setEsAceptado] = useState<boolean>(false); 
    const [mensaje, setMensaje] = useState<string | null>(null); 
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

    // Obtener los estados finales desde el autómata si no se pasaron explícitamente
    const obtenerEstadosFinales = (): Set<string> => {
        if (estadosFinales) {
            return estadosFinales;
        } else if (automaton && automaton.acceptState) {
            return new Set([automaton.acceptState.id.toString()]);  
        } else {
            return new Set();  
        }
    };

    const obtenerEstadoInicial = (): string => {
        if (estadoInicial) {
            return estadoInicial;
        } else if (automaton && automaton.startState) {
            return automaton.startState.id.toString();  
        } else {
            return '';  
        }
    };

    useEffect(() => {
        if (cadena === '') {
            return;
        }

        setMensaje(null); // Reiniciamos el mensaje cuando empieza un nuevo recorrido.
        
        const estadoInicialCalculado = obtenerEstadoInicial();
        const estadosFinalesCalculados = obtenerEstadosFinales(); 

        if (automatonType === 'DFA') {
            const { recorrido, esAceptado } = recorrerDFA(cadena, dfaTransitions!, estadoInicialCalculado, estadosFinalesCalculados);
            setRecorrido(recorrido);
            setEsAceptado(esAceptado);
        } else {
            const table = generateTable(automaton!);
            const { recorrido, esAceptado } = recorrerNFA(cadena, table.transitions, symbols, estadoInicialCalculado, estadosFinalesCalculados);
            setRecorrido(recorrido);
            setEsAceptado(esAceptado);
        }
        setCurrentStep(0);
        setEstadoFinalAlcanzado(null);
        setResetColors(false); 
    }, [cadena, automaton, automatonType, estadoInicial, estadosFinales]);

    useEffect(() => {
        if (currentStep < recorrido.length) {
            const transicion = recorrido[currentStep];

            setEstadoResaltado(transicion.estadoActual);
            setTransicionResaltada(null); 

            const estadoTimeoutId = setTimeout(() => {
                setTransicionResaltada({
                    estadoActual: transicion.estadoActual,
                    siguienteEstado: transicion.siguienteEstado,
                    simbolo: transicion.simbolo,  
                });

                if (currentStep === recorrido.length - 1) {
                    const estadoFinalTimeoutId = setTimeout(() => {
                        setEstadoResaltado(null);
                        setTransicionResaltada(null);
                        setEstadoFinalAlcanzado(transicion.siguienteEstado); 

                        // Mostrar el mensaje al terminar el recorrido
                        if (esAceptado) {
                            setMensaje('La cadena fue reconocida.');
                            setMessageType('success');
                        } else {
                            setMensaje('La cadena no fue reconocida.');
                            setMessageType('error');
                        }

                        const resetFinalTimeoutId = setTimeout(() => {
                            setEstadoFinalAlcanzado(null); 
                        }, 1000); 

                        return () => clearTimeout(resetFinalTimeoutId);
                    }, 500); 

                    return () => clearTimeout(estadoFinalTimeoutId);
                }

                const transicionTimeoutId = setTimeout(() => {
                    setCurrentStep((prevStep) => prevStep + 1);
                }, 500);

                return () => clearTimeout(transicionTimeoutId);
            }, 500); 

            return () => clearTimeout(estadoTimeoutId);
        } else {
            setEstadoResaltado(null);
            setTransicionResaltada(null);
            setEstadoFinalAlcanzado(null); 
        }
    }, [currentStep, recorrido]);

    const dot = automatonType === 'DFA' ?
        dfaToDot(
            Array.from(dfaTransitions!.entries()),
            symbols,
            obtenerEstadosFinales(),  
            estadoInicial!,
            recorrido,
            resetColors ? null : estadoResaltado,  
            resetColors ? null : transicionResaltada,
            esAceptado ? estadoFinalAlcanzado : null 
        )
        : nfaToDot(automaton!, recorrido, estadoResaltado, transicionResaltada, esAceptado ? estadoFinalAlcanzado : null);

    return (
        <div>
            <AutomatonGraph dot={dot} />
            {mensaje && (
                <div className={`mensaje ${messageType}`}>
                    {mensaje}
                </div>
            )}
        </div>
    );
};

export default DynamicAutomaton;
