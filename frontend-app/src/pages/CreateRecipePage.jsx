import React, { useState } from 'react';
import './CreateRecipePage.css';
import InputBox from '../components/Input/InputBox';
import Button from '../components/Button/Button';
import Header from '../components/Header/Header';
import Navbar from '../components/Navbar/Navbar';
// 1. Importar os modais
import UserOptionsModal from '../components/User-options-modal/UserOptionsModal';
import EditProfileModal from '../components/EditProfileModal/EditProfileModal'; 

import { RecipeService } from '../services/apiService';
import { useNavigate } from 'react-router-dom';


export default function CreateRecipePage() {
    // ESTADOS DE LAYOUT E PESQUISA (mantidos)
    const [userOptionsModalIsOpened, setUserOptionsModalIsOpened] = useState(true)
    const [isMobileSearchBarOpened, setIsMobileSearchBarOpened] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [loggedUserType, setLoggedUserType] = useState('chefe') // Usado para modais e Navbar
    const [editProfileModalIsOpened, setEditProfileModalIsOpened] = useState(false)
    const [imageFiles, setImageFiles] = useState(null);
    const navigate = useNavigate(); // Hook de navegação

    const openEditProfileModal = () => { 
        setUserOptionsModalIsOpened(true); // Fecha o menu de opções
        setEditProfileModalIsOpened(true); // Abre o modal de edição
    }

    const closeEditProfileModal = () => {
        setEditProfileModalIsOpened(false);
    }
    
    const mobileSearchBarHandle = () => {
        setIsMobileSearchBarOpened(!isMobileSearchBarOpened)
    }


    // 3. Estados do Formulário (mantidos)
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [steps, setSteps] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [servings, setServings] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 4. Função de Submissão (mantida)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData();

        formData.append('name', title);
        formData.append('description', description);
        formData.append('prepTime', prepTime);
        formData.append('portions', parseInt(servings));

        const ingredientsArray = ingredients.split('\n').filter(i => i.trim() !== '');
        const instructionsArray = steps.split('\n').filter(s => s.trim() !== '');
        const tagsArray = [category.trim()];

        ingredientsArray.forEach(item => formData.append('ingredients', item));
        instructionsArray.forEach(item => formData.append('instructions', item));
        tagsArray.forEach(item => formData.append('tags', item));
        
        if (imageFiles && imageFiles.length > 0) {
            for (let i = 0; i < imageFiles.length; i++) {
                formData.append('recipeImages', imageFiles[i]);
            }
        }

        console.log(formData.values());
        try {
            const newRecipe = await RecipeService.createRecipe(formData);

            console.log('Receita criada com sucesso:', newRecipe);
            alert(`Receita "${newRecipe.name}" enviada com sucesso!`)

            navigate(`/recipe/${newRecipe.recipeId}`);
        } catch (error) {
            console.error('Erro ao criar receita:', error.message);
            alert(`Falha ao criar receita: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="create-recipe-page-container">
            
            {/* Componentes de Layout */}
            <Header 
            searchSetter={setSearchText} 
            userAvatarModalSituation={userOptionsModalIsOpened} 
            userAvatarModalHandle={setUserOptionsModalIsOpened} 
            searchBarHandle={mobileSearchBarHandle} />
            
            <Navbar userType={loggedUserType} /> 
            
            <div className='content'>

                <div className="recipe-form-card">
                    <h2 className="form-title">Crie Sua Nova Receita</h2>

                    <form className="recipe-form" onSubmit={handleSubmit}>
                        
                        {/* Título da Receita */}
                        <InputBox
                            label="Título da Receita"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Bolo de Chocolate Cremoso"
                            required
                        />

                        {/* Descrição (Textarea customizada) */}
                        <div className="form-group-textarea">
                            <label htmlFor="description">Descrição</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Descreva sua receita: o que a torna especial e deliciosa?"
                                className="custom-textarea"
                                rows="4"
                                required
                            />
                        </div>
                        
                        {/* Categoria */}
                        <InputBox
                            label="Categoria"
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Ex: Doces, Prato Principal, Lanches"
                            required
                        />

                        {/* Tempo de Preparo e Porções em uma linha (Flexbox) */}
                        <div className="time-servings-group">
                            <InputBox
                                label="Tempo de Preparo (min)"
                                type="number"
                                value={prepTime}
                                onChange={(e) => setPrepTime(e.target.value)}
                                placeholder="30"
                                required
                            />
                            <InputBox
                                label="Porções"
                                type="number"
                                value={servings}
                                onChange={(e) => setServings(e.target.value)}
                                placeholder="4"
                                required
                            />
                        </div>

                        {/* Ingredientes (Textarea customizada) */}
                        <div className="form-group-textarea">
                            <label htmlFor="ingredients">Ingredientes (Um por linha)</label>
                            <textarea
                                id="ingredients"
                                value={ingredients}
                                onChange={(e) => setIngredients(e.target.value)}
                                placeholder="Ex:&#10;1 xícara de farinha&#10;2 ovos&#10;50g de chocolate"
                                className="custom-textarea"
                                rows="6"
                                required
                            />
                        </div>

                        {/* Modo de Preparo (Textarea customizada) */}
                        <div className="form-group-textarea">
                            <label htmlFor="steps">Modo de Preparo (Um passo por linha)</label>
                            <textarea
                                id="steps"
                                value={steps}
                                onChange={(e) => setSteps(e.target.value)}
                                placeholder="Ex:&#10;1. Misture todos os ingredientes secos.&#10;2. Adicione os líquidos e bata por 5 minutos."
                                className="custom-textarea"
                                rows="8"
                                required
                            />
                        </div>
                        
                        {/* Campo para Upload de Imagem (Placeholder) */}
                        <div className="form-group-image">
                            <label htmlFor="image-upload">Imagem Principal da Receita</label>
                            <input 
                                type="file" 
                                id="image-upload" 
                                accept="image/*" 
                                multiple 
                                onChange={(e) => setImageFiles(e.target.files)} 
                            />
                        </div>


                        {/* Botão de submissão */}
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Enviando...' : 'Enviar Receita para Análise'}
                        </Button>
                    </form>

                </div>
            </div>
            
            {/* RENDERIZAÇÃO DOS MODAIS: ESSENCIAL PARA O BOTÃO DO USUÁRIO FUNCIONAR */}
            <EditProfileModal 
                isOpen={editProfileModalIsOpened}
                onClose={closeEditProfileModal}
                userType={loggedUserType}
            />
            
            {!userOptionsModalIsOpened && 
                <UserOptionsModal 
                    type={loggedUserType}
                    onEditProfileClick={openEditProfileModal} 
                />
            }
        </div>
    );
}