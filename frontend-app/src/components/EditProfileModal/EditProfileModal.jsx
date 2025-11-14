// Cook-and-Tea/frontend-app/src/components/EditProfileModal/EditProfileModal.jsx (MODIFICADO)

import React, { useState, useEffect } from 'react';
import './EditProfileModal.css';

// Componentes reutilizáveis
import InputBox from '../Input/InputBox'; 
import Button from '../Button/Button'; 
// IMPORTANDO o serviço de usuário
import { UserService } from '../../services/apiService'; 

/**
 * Modal centralizado para Edição do Perfil do Usuário.
 */
export default function EditProfileModal({ isOpen, onClose, userType: initialUserType }) {
    // 1. Estados para os dados do perfil
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Usamos 'password' para a nova senha
    const [isChef, setIsChef] = useState(false); // Reflete o campo 'type' do backend
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null); 
    
    // 2. Efeito para carregar dados do usuário ao abrir o modal
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setFetchError(null);
            
            // Função assíncrona para carregar dados atuais
            const fetchCurrentUser = async () => {
                setIsLoading(true);
                try {
                    // Rota: GET /api/users/current
                    const userData = await UserService.getCurrentUser();

                    // Preenche o formulário com os dados atuais
                    setName(userData.name);
                    setEmail(userData.email);
                    setIsChef(userData.type === 'chefe');
                    setPassword(''); // Garante que o campo de senha esteja sempre vazio por segurança

                } catch (err) {
                    console.error("Erro ao carregar dados do usuário:", err);
                    setFetchError('Não foi possível carregar os dados do perfil. Verifique a conexão com a API.');
                } finally {
                    setIsLoading(false);
                }
            };

            fetchCurrentUser();

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

    // 3. Função de submissão (Salvar)
    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const dataToUpdate = {
            name: name,
            email: email,
            type: isChef ? 'chefe' : 'comum',
        };

        // Inclui a senha no payload APENAS se o usuário preencheu o campo
        if (password) {
            dataToUpdate.password = password;
        }

        try {
            // Rota: PUT /api/users/current
            const response = await UserService.updateProfile(dataToUpdate);
            
            console.log('Perfil atualizado:', response);

            alert('Perfil atualizado com sucesso!');
            onClose(); // Fecha o modal após o sucesso
        } catch (error) {
            console.error('Erro ao salvar perfil:', error.message);
            alert(`Falha ao salvar: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
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

                {/* Mensagens de feedback */}
                {isLoading && !fetchError && <p style={{textAlign: 'center', color: '#F77F00'}}>Carregando dados...</p>}
                {fetchError && <p style={{textAlign: 'center', color: 'red'}}>{fetchError}</p>}

                {/* Exibe o formulário se não estiver carregando ou se houver erro */}
                {(!isLoading || fetchError) && (
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

                        {/* Campo Senha (Agora usa 'password' e é opcional) */}
                        <div className="form-group">
                            <label htmlFor="editSenha">Nova Senha (Deixe vazio para manter a atual)</label>
                            <InputBox
                                id="editSenha"
                                type="password"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Digite sua nova senha'
                                required={false} // Senha não é obrigatória para alteração
                            />
                        </div>

                        {/* Opção "Sou Chefe" */}
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
                )}
            </div>
        </div>
    );
}