import React from 'react';
import './Button.css';

/**
 * Componente de Botão reutilizável.
 *
 * @param {object} props - As propriedades do componente.
 * @param {React.ReactNode} props.children - O conteúdo do botão (normalmente o texto).
 * @param {function} props.onClick - Função a ser executada ao clicar no botão.
 * @param {boolean} [props.disabled=false] - Se o botão deve estar desabilitado.
 * @param {string} [props.type='button'] - O tipo do botão (e.g., 'submit', 'button').
 */
export default function Button({ children, onClick, disabled = false, type = 'button' }) {
    return (
        <button
            className="custom-button"
            onClick={onClick}
            disabled={disabled}
            type={type}
        >
            {children}
        </button>
    );
}