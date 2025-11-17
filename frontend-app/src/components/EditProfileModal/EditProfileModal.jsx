// src/components/EditProfileModal/EditProfileModal.jsx

import React, { useState, useEffect } from 'react';
import './EditProfileModal.css';

// Componentes reutilizáveis
import InputBox from '../Input/InputBox'; 
import Button from '../Button/Button'; 
// IMPORTANDO o serviço de usuário
import { UserService } from '../../services/apiService'; 
import ProfileAvatar from '../ProfileAvatar/ProfileAvatar'; // Para o preview~

export default function EditProfileModal({ isOpen, onClose }) {
    // Estados do formulário
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Usado para a *nova* senha
    const [isChef, setIsChef] = useState(false); 
    
    // Estados de controle da UI
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null); 
    
    // Estados para o Upload de Imagem
    const [profilePicFile, setProfilePicFile] = useState(null); // O novo arquivo (File)
    const [currentImageUrl, setCurrentImageUrl] = useState(null); // A URL atual vinda do S3

    /**
     * Efeito: Carrega os dados do usuário atual quando o modal abre.
     */
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setFetchError(null);
            
            const fetchCurrentUser = async () => {
                setIsLoading(true);
                try {
                    // Rota: GET /api/users/current
                    const userData = await UserService.getCurrentUser();

                    // Preenche o formulário com os dados atuais
                    setName(userData.name);
                    setEmail(userData.email);
                    setIsChef(userData.type === 'chefe');
                    setCurrentImageUrl(userData.profilePicUrl); // Salva a URL da imagem atual
                    
                    setPassword(''); // Limpa o campo de senha
                    setProfilePicFile(null); // Limpa o seletor de arquivo

                } catch (err) {
                    console.error("Erro ao carregar dados do usuário:", err);
                    setFetchError('Não foi possível carregar os dados do perfil.');
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
    }, [isOpen]); // Depende apenas de 'isOpen'
    
    if (!isOpen) {
        return null;
    }

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // 1. Criar o FormData
        const formData = new FormData();
        
        // 2. Adicionar os dados de texto
        formData.append('name', name);
        formData.append('email', email);
        formData.append('type', isChef ? 'chefe' : 'comum');
        
        if (password) {
            formData.append('password', password);
        }

        // 3. Adicionar o arquivo de imagem (se um novo foi selecionado)
        if (profilePicFile) {
            formData.append('profilePic', profilePicFile);
        }

        try {
            // 4. Enviar TUDO para a rota PUT /api/users/current
            await UserService.updateProfile(formData);
            
            alert('Perfil atualizado com sucesso!');
            onClose(); 
            window.location.reload(); // Recarrega a página

        } catch (error) {
            console.error('Erro ao salvar perfil:', error.message);
            alert(`Falha ao salvar: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handler: Remove a foto de perfil (DELETE)
     */
    const handleRemoveImage = async () => {
        if (!window.confirm("Tem certeza que deseja remover sua foto de perfil?")) {
            return;
        }

        setIsLoading(true);
        try {
            // Rota: DELETE /api/users/current/profile-pic
            await UserService.deleteProfilePic();
            setCurrentImageUrl(null); // Remove a imagem da UI
            
            alert("Foto removida com sucesso.");
            window.location.reload(); // Recarrega para ver a mudança
        } catch (error) {
            console.error("Erro ao remover foto:", error);
            alert(`Erro: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
                
                <div className="modal-header">
                    <h2>Editar Meu Perfil</h2>
                    <button className="close-button" onClick={onClose} aria-label="Fechar">
                        &times;
                    </button>
                </div>

                {/* Mensagens de feedback */}
                {isLoading && !fetchError && <p style={{textAlign: 'center', color: '#F77F00'}}>Carregando dados...</p>}
                {fetchError && <p style={{textAlign: 'center', color: 'red'}}>{fetchError}</p>}

                {/* Exibe o formulário se não estiver carregando ou se houver erro */}
                {(!isLoading || fetchError) && (
                    <div className="edit-profile-form-container">
                        
                        {/* Pré-visualização do Avatar */}
                        <div className='profile-pic-preview'>
                            <ProfileAvatar 
                                // Se o usuário selecionou um novo arquivo, mostra o preview (URL local).
                                // Senão, mostra a URL atual (vinda do S3).
                                imageUrl={profilePicFile ? URL.createObjectURL(profilePicFile) : currentImageUrl} 
                                size="100px" 
                            />
                        </div>
                    
                        {/* Formulário de Upload (para a foto) */}
                        <form className="edit-profile-form" onSubmit={handleSave}>
                            <div className="form-group-image">
                                <label htmlFor="profilePic">Trocar Foto de Perfil (Opcional)</label>
                                <input 
                                    type="file" 
                                    id="profilePic" 
                                    name="profilePic" 
                                    accept="image/*"
                                    onChange={(e) => setProfilePicFile(e.target.files[0])}
                                />
                            </div>
                        
                            {/* Botão de Remoção (Só aparece se houver imagem) */}
                            {currentImageUrl && (
                                <Button 
                                    type="button" 
                                    className="remove-button" 
                                    disabled={isLoading}
                                    onClick={handleRemoveImage}
                                >
                                    Remover Foto Atual
                                </Button>
                            )}
                        
                            <hr className="separator" />

                            {/* Formulário de Dados (Nome, Email, etc.) */}
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

                            <div className="form-group">
                                <label htmlFor="editSenha">Nova Senha (Deixe vazio para manter a atual)</label>
                                <InputBox
                                    id="editSenha"
                                    type="password"
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder='Digite sua nova senha'
                                    required={false} // Senha não é obrigatória
                                />
                            </div>

                            <div className="form-group-chef-toggle">
                                <input 
                                    type="checkbox" 
                                    id="editIsChef" 
                                    checked={isChef}
                                    onChange={() => setIsChef(!isChef)}
                                />
                                <label htmlFor="editIsChef">Sou Chef (Permitir postagem de receitas)</label>
                            </div>

                            <Button type="submit" className="save-button" disabled={isLoading}>
                                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}