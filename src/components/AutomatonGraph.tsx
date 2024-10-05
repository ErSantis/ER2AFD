import React, { useEffect, useRef } from 'react';
import Viz from 'viz.js';
import { Module, render } from 'viz.js/full.render.js';

interface AutomatonGraphProps {
  dot: string; // El string DOT que representa el autómata
}

const AutomatonGraph: React.FC<AutomatonGraphProps> = ({ dot }) => {
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viz = new Viz({ Module, render });

    viz.renderSVGElement(dot)
      .then((element: any) => {
        if (graphRef.current) {
          graphRef.current.innerHTML = ''; // Limpiar el contenido anterior
          graphRef.current.appendChild(element); // Agregar el nuevo gráfico
        }
      })
      .catch((error: any) => {
        console.error('Error rendering DOT:', error);
      });

  }, [dot]); // El gráfico se renderiza cada vez que el string DOT cambia

  return <div ref={graphRef}></div>;
};

export default AutomatonGraph;
