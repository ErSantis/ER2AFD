export function escapeDotLabel(label: string): string {
    return label
      .replace(/\\/g, '\\\\')  // Escapar barra invertida
      .replace(/"/g, '\\"')    // Escapar comillas dobles
      .replace(/\n/g, '\\n')   // Escapar saltos de línea
      .replace(/{/g, '\\{')    // Escapar llaves izquierda
      .replace(/}/g, '\\}');   // Escapar llaves derecha
  }
  