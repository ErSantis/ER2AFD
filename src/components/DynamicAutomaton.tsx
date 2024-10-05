import React, { useState, useEffect } from 'react';
import { recorrerDFA } from '../utils/recorrerDFA'; // La función que recorre el DFA
import AutomatonGraph from './AutomatonGraph'; // El componente para renderizar el grafo
import { dfaToDot } from '../utils/AutomatonToDot';

const DynamicAutomaton: React.FC<{
    dfaTransitions: Map<string, Map<string, string>>,
    symbols: string[],
    estadosFinales: Set<string>,
    estadoInicial: string,
    cadena: string
}> = ({ dfaTransitions, symbols, estadosFinales, estadoInicial, cadena }) => {
    const [recorrido, setRecorrido] = useState<{ estadoActual: string, siguienteEstado: string, simbolo: string }[]>([]);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [estadoResaltado, setEstadoResaltado] = useState<string | null>(null);
    const [transicionResaltada, setTransicionResaltada] = useState<{ estadoActual: string, siguienteEstado: string } | null>(null);
    const [estadoFinalAlcanzado, setEstadoFinalAlcanzado] = useState<string | null>(null);
    const [resetColors, setResetColors] = useState<boolean>(false); // Nuevo estado para reiniciar colores

    useEffect(() => {
        const { recorrido } = recorrerDFA(cadena, dfaTransitions, estadoInicial, estadosFinales);
        setRecorrido(recorrido);
        setCurrentStep(0);
        setEstadoFinalAlcanzado(null);
        setResetColors(false); // Al comenzar el recorrido, asegurarse de que no estemos en modo de reset
    }, [cadena, dfaTransitions, estadoInicial, estadosFinales]);

    useEffect(() => {
        if (currentStep < recorrido.length) {
            const transicion = recorrido[currentStep];

            // Resaltar el estado actual primero
            setEstadoResaltado(transicion.estadoActual);
            setTransicionResaltada(null); // Asegurarnos de que la transición aún no esté resaltada

            const estadoTimeoutId = setTimeout(() => {
                // Después de 500 ms resaltar la transición correspondiente
                setTransicionResaltada({ estadoActual: transicion.estadoActual, siguienteEstado: transicion.siguienteEstado });

                // Si estamos en el penúltimo paso y el siguiente estado es el estado final
                if (currentStep === recorrido.length - 1 && estadosFinales.has(transicion.siguienteEstado)) {
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



    const dot = dfaToDot(
        Array.from(dfaTransitions.entries()),
        symbols,
        estadosFinales,
        estadoInicial,
        recorrido,
        resetColors ? null : estadoResaltado,  // Reiniciar colores si estamos en modo de reset
        resetColors ? null : transicionResaltada,
        resetColors ? null : estadoFinalAlcanzado
    );

    return <AutomatonGraph dot={dot} />;
};

export default DynamicAutomaton;
