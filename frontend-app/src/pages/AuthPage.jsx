import React, { useState } from 'react';
import './AuthPage.css';

// Importando os componentes reutilizáveis
import InputBox from '../components/Input/InputBox';
import Button from '../components/Button/Button';
import HomeButton from '../components/HomeButton/HomeButton';  
import { AuthService } from '../services/apiService';

import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
    const navigate = useNavigate();
    // 1. Estados para o formulário
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isChef, setIsChef] = useState(false); // Estado para a checkbox
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleGoHome = () => {
        // Lógica de navegação real:
        navigate('/Home');  
    };
    // 2. Função de manipulação do formulário (Login/Cadastro)
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o recarregamento padrão da página
        setIsLoading(true);
        try {
            let response;
            if (isLogin) {
                // Lógica de Login
                response = await AuthService.login(email, password);
                alert('Login realizado com sucesso! Bem-vindo(a), ' + response.name);
            } else {
                // Lógica de Cadastro
                response = await AuthService.register(name, email, password, isChef);
                alert('Cadastro realizado com sucesso! Agora você pode fazer login, ' + response.name);
            }

            console.log('Autenticação bem-sucedida:', response);
            // Redirecionar para a página inicial após o login/cadastro bem-sucedido
            handleGoHome();
        }
        catch (error) {
            console.error('Erro na autenticação:', error);
            alert('Erro: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };
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