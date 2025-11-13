import React, { useState } from 'react';
import './AuthPage.css';

// Importando os componentes reutilizáveis
import InputBox from '../components/Input/InputBox';
import Button from '../components/Button/Button';
import HomeButton from '../components/HomeButton/HomeButton';  
 
// Nota: Vamos criar o componente Checkbox em breve!
// Por enquanto, farei um placeholder simples para a funcionalidade "Sou Chefe".

export default function AuthPage() {
    // 1. Estados para o formulário
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isChef, setIsChef] = useState(false); // Estado para a checkbox

    // 2. Função de manipulação do formulário (Login/Cadastro)
    const handleSubmit = (e) => {
        e.preventDefault(); // Previne o recarregamento padrão da página
        
        // Lógica de autenticação virá aqui (API call, etc.)
        console.log('Dados submetidos:');
        console.log('Nome:', name);
        console.log('Email:', email);
        console.log('Senha:', password);
        console.log('É Chefe?', isChef);

        alert(`Autenticação simulada. Nome: ${name}, Email: ${email}, É Chefe: ${isChef}`);
    };

    // 3. Função para alternar entre Login e Cadastro (opcional, mas comum)
    const [isLogin, setIsLogin] = useState(true);

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="auth-page-container">
            {/* Botão flutuante para voltar à Home */}
            <HomeButton />
            
            <div className="auth-card">
                
                {/* Título dinâmico */}
                <h2 className="auth-title">{isLogin ? 'Faça Login' : 'Cadastre-se'}</h2>

                {/* Formulário principal */}
                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && ( 
                        <>
                            {/* Campo de Nome */}
                            <InputBox
                                label="Nome Completo"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </>
                    )}

                    {/* Campo de Email */}
                    <InputBox
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {/* Campo de Senha */}
                    <InputBox
                        label="Senha"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* --- Opções de Escolha de Perfil (Apenas no Modo Cadastro) --- */}
                    {!isLogin && (
                        <div className="user-type-selection">
                            <h3>Tipo de Perfil:</h3>
        
                            {/* Opção "Sou chefe" */}
                            <div className="radio-option">
                                <input 
                                    type="radio" 
                                    id="isChefYes" 
                                    name="userType" // Importante: o mesmo name para ambos
                                    value="chef"
                                    checked={isChef === true} // Verifica se o estado é true
                                    onChange={() => setIsChef(true)} // Define o estado como true
                                />
                                <label htmlFor="isChefYes">Sou chefe (**Quero postar receitas deliciosas**)</label>
                            </div>

                            {/* Opção "Não sou chefe" */}
                            <div className="radio-option">
                                <input 
                                    type="radio" 
                                    id="isChefNo" 
                                    name="userType" // Importante: o mesmo name para ambos
                                    value="notChef"
                                    checked={isChef === false} // Verifica se o estado é false
                                    onChange={() => setIsChef(false)} // Define o estado como false
                                />
                                <label htmlFor="isChefNo">Não sou chefe (**Quero apenas visualizar receitas**)</label>
                            </div>
                        </div>
                    )}
                    {/* ---------------------------------------------------------------- */}

                    {/* Botão de submissão */}
                    <Button type="submit">
                        {isLogin ? 'Entrar' : 'Criar Conta'}
                    </Button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin ? 'Ainda não tem conta?' : 'Já tem conta?'}
                        <span 
                            className="toggle-link" 
                            onClick={toggleAuthMode}
                        >
                            {isLogin ? ' Cadastre-se agora!' : ' Faça Login!'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}