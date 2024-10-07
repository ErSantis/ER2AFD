# Automata Builder

Automata Builder is an application that allows you to construct deterministic finite automata (DFA), non-deterministic finite automata (NFA), and minimized deterministic automata (mDFA) from a regular expression. Users can build the automaton, enter a test string, and visualize whether the string is accepted by the automaton.

## Features

- Automaton construction from regular expressions.
- Support for NFA, DFA, and mDFA.
- Automaton visualization in state graph form.
- String simulation in the constructed automaton.
- Regular expression validation with support for special characters such as `&` (empty string).
- Automatically generated transition tables.
- Performance testing with complex regular expressions and long strings.

## Prerequisites

Make sure you have the following tools installed on your machine:

- **Node.js**: version 14.x or higher
- **npm**: version 6.x or higher
- **git**: to clone the repository

You can check if you have `Node.js` and `npm` installed by running the following commands in your terminal:

```bash
node -v
npm -v
```

If you don't have `Node.js` installed, you can download it from the official website:
[https://nodejs.org/](https://nodejs.org/)

## Installation

To install the Automata Builder, follow these steps:

1. Clone the repository to your local machine using the following command:

```bash
git clone https://github.com/ErSantis/ER2AFD.git
```

2. Navigate into the cloned repository:

```bash
   cd ER2AFD
```

3. Install the project dependencies:

```bash
   npm install
```

4. Start the application:

```bash
   npm run dev
```

5. Open your web browser and navigate to `http://localhost:3000` to access the

## Usage

To use the Automata Builder, follow these steps:

1. Open your web browser and navigate to `http://localhost:3000`.
2. Enter a regular expression in the input field.
3. Click the `Build Automaton` button.
4. Visualize the automaton in the state graph.
5. Enter a test string in the input field.
6. Click the `Simulate String` button to check whether the string is accepted by the automaton.

Or go to the website [https://er-2-afd.vercel.app/](https://er-2-afd.vercel.app/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Output

```bash
├── src
│   ├── components      # Componentes principales de React
│   ├── models          # Modelos de datos y estructuras
│   ├── styles          # Estilos en CSS y variables de estilo
│   ├── utils           # Funciones de utilidad (e.g., generación de autómatas)
│   ├── App.tsx         # Componente principal de la aplicación
│   ├── index.tsx       # Punto de entrada de React
│   └── types           # Definiciones de tipos TypeScript
├── public
│   ├── index.html      # Archivo HTML principal
│   └── logo.png        # Logo de la aplicación
├── package.json        # Dependencias y scripts de npm
└── README.md           # Archivo que estás leyendo

```

## Contributing

Contributions are welcome! Here are some ways you can contribute to this project:

- Report bugs and make suggestions for new features by opening an issue.
- Implement new features or fix bugs by opening a pull request.
- Improve the project documentation by opening a pull request.

## Authors

- **Elkin Santis** - _Initial work_ - [ErSantis]
