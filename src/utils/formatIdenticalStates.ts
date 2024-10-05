export const formatIdenticalStates = (equivalentes: string[]) => {
    if (equivalentes.length === 2) {
      return `${equivalentes[0]} y ${equivalentes[1]} se identifican`;
    } else if (equivalentes.length > 2) {
      const lastState = equivalentes.pop();
      return `${equivalentes.join(', ')} y ${lastState} se identifican`;
    }
    return '';
  };