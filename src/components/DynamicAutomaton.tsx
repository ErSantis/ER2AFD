import React, { useState, useEffect } from 'react';
import AutomatonGraph from './AutomatonGraph';
import { dfaToDot, nfaToDot } from '../utils/AutomatonToDot';
import { recorrerDFA } from '../utils/recorrerDFA';
import { recorrerNFA } from '../utils/recorrerNFA';
import { generateTable } from '../utils/generateTable';
import { DynamicAutomatonPros } from '../types/DynamicAutomaton.type';

const DynamicAutomaton: React.FC<DynamicAutomatonPros> = ({ automatonType, automaton, dfaTransitions, symbols, estadosFinales, estadoInicial, cadena }) => {
    const [recorrido, setRecorrido] = useState<{ estadoActual: string, siguienteEstado: string, simbolo: string }[]>([]);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [estadoResaltado, setEstadoResaltado] = useState<string | null>(null);
    const [transicionResaltada, setTransicionResaltada] = useState<{ estadoActual: string, siguienteEstado: string, simbolo: string } | null>(null);
    const [estadoFinalAlcanzado, setEstadoFinalAlcanzado] = useState<string | null>(null);
    const [resetColors, setResetColors] = useState<boolean>(false); // Estado para resetear los colores

    // Obtener los estados finales desde el autómata si no se pasaron explícitamente
    const obtenerEstadosFinales = (): Set<string> => {
        if (estadosFinales) {
            return estadosFinales;
        } else if (automaton && automaton.acceptState) {
            return new Set([automaton.acceptState.id.toString()]);  // Convertimos el ID del estado final a string
        } else {
            return new Set();  // Si no hay estado final, retornamos un conjunto vacío
        }
    };

    const obtenerEstadoInicial = (): string => {
        if (estadoInicial) {
            return estadoInicial;
        } else if (automaton && automaton.startState) {
            return automaton.startState.id.toString();  // Convertimos el ID del estado inicial a string
        } else {
            return '';  // Si no hay estado inicial, retornamos una cadena vacía
        }
    };

    useEffect(() => {
        const estadoInicialCalculado = obtenerEstadoInicial();
        const estadosFinalesCalculados = obtenerEstadosFinales();  // Calculamos los estados finales en caso de que no los tengamos

        if (automatonType === 'DFA') {
            const { recorrido } = recorrerDFA(cadena, dfaTransitions!, estadoInicialCalculado, estadosFinalesCalculados);
            setRecorrido(recorrido);
        } else {
            const table = generateTable(automaton!);
            const { recorrido } = recorrerNFA(cadena, table.transitions, symbols, estadoInicialCalculado, estadosFinalesCalculados);
            setRecorrido(recorrido);
        }
        setCurrentStep(0);
        setEstadoFinalAlcanzado(null);
        setResetColors(false); // Reiniciamos los colores al empezar un nuevo recorrido
    }, [cadena, automaton, automatonType, estadoInicial, estadosFinales]);

    useEffect(() => {
        const estadosFinalesCalculados = obtenerEstadosFinales();

        if (currentStep < recorrido.length) {
            const transicion = recorrido[currentStep];

            // Resaltar el estado actual primero
            setEstadoResaltado(transicion.estadoActual);
            setTransicionResaltada(null); // Asegurarnos de que la transición aún no esté resaltada

            const estadoTimeoutId = setTimeout(() => {
                // Resaltamos solo la transición actual después de 500 ms
                setTransicionResaltada({
                    estadoActual: transicion.estadoActual,
                    siguienteEstado: transicion.siguienteEstado,
                    simbolo: transicion.simbolo,  // Incluimos el símbolo en la transición resaltada
                });

                // Si estamos en el penúltimo paso y el siguiente estado es un estado final
                if (currentStep === recorrido.length - 1 && estadosFinalesCalculados.has(transicion.siguienteEstado)) {
                    const estadoFinalTimeoutId = setTimeout(() => {
                        // Limpiamos la flecha y el penúltimo estado antes de resaltar el estado final
                        setEstadoResaltado(null);
                        setTransicionResaltada(null);
                        setEstadoFinalAlcanzado(transicion.siguienteEstado); // Resaltamos el estado final

                        const resetFinalTimeoutId = setTimeout(() => {
                            setEstadoFinalAlcanzado(null); // Reseteamos el color del estado final después de un tiempo
                        }, 1000); // Tiempo adicional para que el estado final se quede resaltado un momento

                        return () => clearTimeout(resetFinalTimeoutId);
                    }, 500); // Espera antes de resaltar el estado final

                    return () => clearTimeout(estadoFinalTimeoutId);
                }

                // Avanzamos al siguiente paso después de otro medio segundo
                const transicionTimeoutId = setTimeout(() => {
                    setCurrentStep((prevStep) => prevStep + 1);
                }, 500);

                return () => clearTimeout(transicionTimeoutId);
            }, 500); // Esperamos 500 ms antes de resaltar la transición

            return () => clearTimeout(estadoTimeoutId);
        } else {
            setEstadoResaltado(null);
            setTransicionResaltada(null);
            setEstadoFinalAlcanzado(null); // Resetear el estado final cuando se termina el recorrido
        }
    }, [currentStep, recorrido]);

    // Generar el DOT dependiendo del tipo de autómata
    const dot = automatonType === 'DFA' ?
        dfaToDot(
            Array.from(dfaTransitions!.entries()),
            symbols,
            obtenerEstadosFinales(),  // Usamos los estados finales calculados
            estadoInicial!,
            recorrido,
            resetColors ? null : estadoResaltado,  // Resetear colores si es necesario
            resetColors ? null : transicionResaltada,
            resetColors ? null : estadoFinalAlcanzado
        )
        : nfaToDot(automaton!, recorrido, estadoResaltado, transicionResaltada, estadoFinalAlcanzado);

    return <AutomatonGraph dot={dot} />;
};

export default DynamicAutomaton;
