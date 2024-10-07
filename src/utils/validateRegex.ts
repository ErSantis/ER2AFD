export const validateRegex = (input: string, setIsButtonEnabled: (enabled: boolean) => void) => {
    // Si el input está vacío, deshabilitamos el botón
    if (input.trim() === '') {
        setIsButtonEnabled(false);
        return;
    }

    // Validar que no haya espacios en blanco
    const hasSpaces = (input: string): boolean => {
        return /\s/.test(input);  // Busca cualquier espacio en blanco
    };
    if (hasSpaces(input)) {
        setIsButtonEnabled(false);
        return;
    }
    // Linea sin nada para probar los comits
    // Validar que empiece con algo válido (un carácter o una expresión entre paréntesis)
    const validStartRegex = /^([^)\\|*?+]+.*)$/;
    if (!validStartRegex.test(input)) {
        setIsButtonEnabled(false);
        return;
    }

    // Validar que no contenga caracteres reservados
    // const hasReservedCharacters = /[\\\"]/;
    // if (hasReservedCharacters.test(input)) {
    //     setIsButtonEnabled(false);
    //     return;
    // }

    // Validar que no se repitan más de una vez los caracteres ?, +, y *
    const invalidRepeatRegex = /(\?|\+|\*)(\?|\+|\*)+/;
    if (invalidRepeatRegex.test(input)) {
        setIsButtonEnabled(false);
        return;
    }

    // Validar que los | tengan algo a ambos lados
    const arePipesValid = (input: string): boolean => {
        // Asegurarse de que no haya pipes consecutivos sin nada válido entre ellos
        const invalidPipesRegex = /\|\||\(\||\|\)|\|[*+?)]|(?<!\()\|(?=\))/;
        
        // Verificar si termina con un | 
        if (input.endsWith("|")) {
            return false;
          }

        // Retorna true si no hay casos de pipes inválidos
        return !invalidPipesRegex.test(input);
    };

    // Si el input contiene un pipe y no pasa la validación de pipes, desactiva el botón
    if (input.includes("|") && !arePipesValid(input)) {
        setIsButtonEnabled(false);
        return;
    }

    // Validar que los parentesis no esten vacios
    const hasEmptyParentheses = (input: string): boolean => {
        const emptyParenthesesRegex = /\(\)|\([*+?|]\)/;
        return emptyParenthesesRegex.test(input);
    };
    if (hasEmptyParentheses(input)) {
        setIsButtonEnabled(false);
        return;
    }
    const areParenthesesBalanced = (str: string): boolean => {
        let stack: string[] = [];
        for (let char of str) {
            if (char === '(') {
                stack.push(char);
            } else if (char === ')') {
                if (stack.length === 0) {
                    return false;
                }
                stack.pop();
            }
        }
        return stack.length === 0;
    };

    if (!areParenthesesBalanced(input)) {
        setIsButtonEnabled(false);
        return;
    }
    setIsButtonEnabled(true);
};

function hasSpaces(input: string) {
    throw new Error("Function not implemented.");
}
