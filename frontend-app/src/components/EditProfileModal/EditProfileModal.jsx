import React, { useState, useEffect } from 'react';
import './EditProfileModal.css';

// Componentes reutilizáveis (assumindo que estão disponíveis)
import InputBox from '../Input/InputBox'; // Opcional, usarei input nativo aqui para simplificar
import Button from '../Button/Button'; 

/**
 * Modal centralizado para Edição do Perfil do Usuário.
 *
 * @param {object} props - As propriedades do componente.
 * @param {boolean} props.isOpen - Indica se o modal deve estar aberto.
 * @param {function} props.onClose - Função para fechar o modal.
 * @param {string} [props.userType='leitor'] - O tipo de usuário logado ('chefe' ou 'leitor').
 */
export default function EditProfileModal({ isOpen, onClose, userType = 'leitor' }) {
    // 1. Estados simulados para os dados do perfil
    const [name, setName] = useState('Nome do Usuário Atual');
    const [email, setEmail] = useState('usuario.atual@email.com');
    const [senha, setSenha] = useState('senha_atual');
    const [isChef, setIsChef] = useState(userType === 'chefe');
    const [isLoading, setIsLoading] = useState(false);

    // 2. Efeito para bloquear a rolagem do corpo da página (melhorando a UX)
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);
    
    if (!isOpen) {
        return null;
    }

    // 3. Função de submissão do formulário
    const handleSave = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulação de chamada de API para salvar os dados
        console.log('Salvando dados do perfil:', { name, email, senha, isChef });

        setTimeout(() => {
            alert('Perfil atualizado com sucesso! (Simulação)');
            setIsLoading(false);
            onClose(); // Fecha o modal após o salvamento
        }, 1500);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* O onClick no div principal fecha o modal, mas o stopPropagation no conteúdo previne isso */}
            <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
                
                <div className="modal-header">
                    <h2>Editar Meu Perfil</h2>
                    {/* Botão de fechar (usando um 'X' simples) */}
                    <button className="close-button" onClick={onClose} aria-label="Fechar">
                        &times;
                    </button>
                </div>

                <form className="edit-profile-form" onSubmit={handleSave}>
                    
                    {/* Campo Nome */}
                    <div className="form-group">
                        <label htmlFor="editName">Nome Completo</label>
                        <InputBox
                            id="editName"
                            type="text"
                            value={name}
                            placeholder='Digite seu nome completo'
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Campo Email */}
                    <div className="form-group">
                        <label htmlFor="editEmail">Email</label>
                        <InputBox
                            id="editEmail"
                            type="email"
                            value={email}
                            placeholder='Digite seu email'
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Campo Senha */}
                    <div className="form-group">
                        <label htmlFor="editSenha">Senha</label>
                        <InputBox
                            id="editSenha"
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder='Digite sua senha'
                            required
                        />
                    </div>

                    {/* Opção "Sou Chefe" (só pode ser alterada se o usuário já for ou se estiver cadastrando) */}
                    <div className="form-group-chef-toggle">
                        <input 
                            type="checkbox" 
                            id="editIsChef" 
                            checked={isChef}
                            onChange={() => setIsChef(!isChef)}
                        />
                        <label htmlFor="editIsChef">Sou Chef (Permitir postagem de receitas)</label>
                    </div>

                    {/* Botão de Ação */}
                    <Button type="submit" className="save-button" disabled={isLoading}>
                        {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                    
                </form>
            </div>
        </div>
    );
}