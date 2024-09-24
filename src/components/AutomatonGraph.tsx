import React, { useEffect, useRef } from 'react';
import Viz from 'viz.js';
import { Module, render } from 'viz.js/full.render.js';
import { visualizeNFA } from '../utils/AutomatonToDot'
import { Automaton } from '../utils/Automaton';

type AutomatonGraphProps = {
  automaton: Automaton;
};

const AutomatonGraph: React.FC<AutomatonGraphProps> = ({ automaton }) => {
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viz = new Viz({ Module, render });
    const dot = visualizeNFA(automaton);

    viz.renderSVGElement(dot)
      .then((element: any) => {
        if (graphRef.current) {
          graphRef.current.innerHTML = ''; // Limpiar el contenido anterior
          graphRef.current.appendChild(element);
        }
      })
      .catch((error: any) => {
        console.error('Error rendering DOT:', error);
      });

  }, [automaton]);

  return <div ref={graphRef}></div>;
};

export default AutomatonGraph;
