import React, { useState } from 'react';
import './InputBox.css';
// Se você estiver usando ícones (ex: Font Awesome, Lucide, etc.), 
// importe-os aqui. Por enquanto, usaremos texto ou emojis.

/**
 * Componente de Input reutilizável.
 *
 * @param {object} props - As propriedades do componente.
 * @param {string} props.label - O texto do rótulo (label) do input.
 * @param {string} props.type - O tipo do input (e.g., 'text', 'password', 'email').
 * @param {string} props.value - O valor atual do input.
 * @param {function} props.onChange - Função a ser chamada quando o valor do input muda.
 * @param {string} [props.placeholder=''] - O texto de placeholder do input.
 * @param {string} [props.name] - O atributo 'name' do input.
 */
export default function InputBox({ label, type, value, onChange, placeholder = '', name }) {
    // Estado para controlar a visibilidade da senha (apenas se o type for 'password')
    const [showPassword, setShowPassword] = useState(false);

    // Determina o tipo de input real a ser renderizado
    const inputType = type === 'password' && showPassword ? 'text' : type;

    // Se for um campo de senha, habilita a funcionalidade de toggle
    const isPasswordField = type === 'password';

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <div className="input-box-container">
            <label htmlFor={name || label.toLowerCase().replace(/\s/g, '-')}>
                {label}
            </label>
            <div className={`input-field-wrapper ${isPasswordField ? 'password-field' : ''}`}>
                <input
                    id={name || label.toLowerCase().replace(/\s/g, '-')}
                    name={name}
                    type={inputType} // Usa o tipo determinado (text ou password)
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder || `Digite seu ${label.toLowerCase()}`}
                    className="custom-input"
                />
                
                {/* Ícone/Botão de alternância da visibilidade da senha */}
                {isPasswordField && (
                    <button 
                        type="button" // Essencial para não submeter o formulário
                        className="password-toggle-button"
                        onClick={togglePasswordVisibility}
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                        {/* Você pode substituir 👁️ por um ícone SVG ou de uma biblioteca */}
                        {showPassword ? '🔒' : '👁️'} 
                    </button>
                )}
            </div>
        </div>
    );
}