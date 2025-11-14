import React from 'react';
import './HomeButton.css';
import { useNavigate } from 'react-router-dom';
// Nota: Em um projeto real com React Router, você usaria:

/**
 * Botão flutuante que simula o retorno à página Home.
 * Deve ser usado fora do fluxo principal do formulário.
 */
export default function HomeButton() {
    const navigate = useNavigate(); // Exemplo de como usar o router

    const handleGoHome = () => {
        // Lógica de navegação real:
        navigate('/Home');  
    };

    return (
        <button 
            className="home-return-button" 
            onClick={handleGoHome}
            aria-label="Voltar para a página inicial"
        >
            {/* Ícone de Voltar fácil que achei */}
            🔙 Voltar
        </button>
    );
}