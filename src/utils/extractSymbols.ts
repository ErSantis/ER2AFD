export const extractSymbolsFromRegxex = (regex: string): string[] => {
    const alphabet = new Set<string>();
    for (let i = 0; i < regex.length; i++) {
      const char = regex[i];
      if (char !== '(' && char !== ')' && char !== '|' && char !== '*' && char !== '+' && char !== '?') {
        alphabet.add(char);
      }
    }
    return Array.from(alphabet);
  };