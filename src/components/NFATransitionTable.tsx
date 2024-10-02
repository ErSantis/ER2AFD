import React from 'react';
import '../styles/TransitionTable.css';
import { TransitionTableProps } from '../types/TransitionTable.type';
import { generateTable } from '../utils/generateTable';

const TransitionTable: React.FC<TransitionTableProps> = ({ automaton }) => {
    const { transitions, symbols } = generateTable(automaton);

    return (
        <table className="transition-table">
            <thead>
                <tr>
                    <th>State</th>
                    {symbols.map((symbol) => (
                        <th key={symbol}>{symbol}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {transitions.map((row, index) => (
                    <tr key={index}>
                        {/* Verificar si el estado es inicial o final y añadir la flecha o el asterisco */}
                        <td>
                            {row.state === automaton.startState.id && '→'}
                            {row.state === automaton.acceptState.id && '*'}
                            {row.state}
                        </td>
                        {symbols.map((symbol) => (
                            <td key={symbol}>
                                {row.transitions[symbol] ? row.transitions[symbol]!.toString() : '-'}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TransitionTable;
