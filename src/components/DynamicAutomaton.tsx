import React, { useState, useEffect } from 'react';
import AutomatonGraph from './AutomatonGraph';
import { dfaToDot, nfaToDot } from '../utils/AutomatonToDot';
import { recorrerDFA } from '../utils/recorrerDFA';
import { recorrerNFA } from '../utils/recorrerNFA';
import { Automaton } from '../models/Automaton';
import { generateTable } from '../utils/generateTable';

const DynamicAutomaton: React.FC<{
    automatonType: 'DFA' | 'NFA',  // Agregamos el tipo de autómata
    automaton?: Automaton,
    dfaTransitions?: Map<string, Map<string, string>>,  // Puede ser NFA o DFA
    symbols: string[],
    estadosFinales?: Set<string>,
    estadoInicial?: string,
    cadena: string
}> = ({ automatonType, automaton, dfaTransitions, symbols, estadosFinales, estadoInicial, cadena }) => {
    const [recorrido, setRecorrido] = useState<{ estadoActual: string, siguienteEstado: string, simbolo: string }[]>([]);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [estadoResaltado, setEstadoResaltado] = useState<string | null>(null);
    const [transicionResaltada, setTransicionResaltada] = useState<{ estadoActual: string, siguienteEstado: string } | null>(null);
    const [estadoFinalAlcanzado, setEstadoFinalAlcanzado] = useState<string | null>(null);

    useEffect(() => {
        if (automatonType === 'DFA') {
            const { recorrido } = recorrerDFA(cadena, dfaTransitions!, estadoInicial!, estadosFinales!);
            setRecorrido(recorrido);
        } else {
            const table = generateTable(automaton!);
            const { recorrido } = recorrerNFA(cadena, table.transitions, symbols);
            setRecorrido(recorrido);
        }
        setCurrentStep(0);
        setEstadoFinalAlcanzado(null);
    }, [cadena, automaton, automatonType, estadoInicial, estadosFinales]);

    useEffect(() => {
        if (currentStep < recorrido.length) {
            const transicion = recorrido[currentStep];
            console.log(transicion);

            // Resaltar el estado actual primero
            setEstadoResaltado(transicion.estadoActual);
            setTransicionResaltada(null); // Asegurarnos de que la transición aún no esté resaltada

            const estadoTimeoutId = setTimeout(() => {
                // Después de 500 ms resaltar la transición correspondiente
                setTransicionResaltada({ estadoActual: transicion.estadoActual, siguienteEstado: transicion.siguienteEstado });

                // Si estamos en el penúltimo paso y el siguiente estado es el estado final
                if (currentStep === recorrido.length - 1 && estadosFinales && estadosFinales.has(transicion.siguienteEstado)) {
                    const estadoFinalTimeoutId = setTimeout(() => {
                        // Limpiar la flecha y el penúltimo estado antes de resaltar el estado final
                        setEstadoResaltado(null);
                        setTransicionResaltada(null);
                        setEstadoFinalAlcanzado(transicion.siguienteEstado); // Resaltar el estado final después de la transición

                        // Agregar un temporizador adicional para volver el estado final a su color original
                        const resetFinalTimeoutId = setTimeout(() => {
                            setEstadoFinalAlcanzado(null); // Volver el estado final a su color original
                        }, 1000); // Tiempo adicional para dejar el estado final resaltado antes de resetearlo

                        return () => clearTimeout(resetFinalTimeoutId);
                    }, 500); // Retrasar el resaltado del estado final

                    return () => clearTimeout(estadoFinalTimeoutId);
                }

                // Avanzar al siguiente paso después de otro segundo
                const transicionTimeoutId = setTimeout(() => {
                    setCurrentStep((prevStep) => prevStep + 1);
                }, 500); // Avanzar después de 500 ms

                return () => clearTimeout(transicionTimeoutId);
            }, 500); // Esperar 500 ms para resaltar la transición

            return () => clearTimeout(estadoTimeoutId);
        } else {
            setEstadoResaltado(null);
            setTransicionResaltada(null);
            setEstadoFinalAlcanzado(null); // Resetear el estado final alcanzado
        }
    }, [currentStep, recorrido, estadosFinales]);

    // Seleccionar el renderizado del autómata adecuado para NFA o DFA
    const dot = automatonType === 'DFA' ?
        dfaToDot(
            Array.from(dfaTransitions!.entries()),
            symbols,
            estadosFinales!,
            estadoInicial!,
            recorrido,
            estadoResaltado,
            transicionResaltada,
            estadoFinalAlcanzado
        )
        : nfaToDot(
            automaton!,
            recorrido,
            estadoResaltado,
            transicionResaltada,
            estadoFinalAlcanzado
        ); // Para NFA, usamos `nfaToDot`

    return <AutomatonGraph dot={dot} />;
};

export default DynamicAutomaton;
