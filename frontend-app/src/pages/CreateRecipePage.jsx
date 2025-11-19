import React, { useState,useEffect } from 'react';
import './CreateRecipePage.css';
import InputBox from '../components/Input/InputBox';
import Button from '../components/Button/Button';
import Header from '../components/Header/Header';
import Navbar from '../components/Navbar/Navbar';
// 1. Importar os modais
import UserOptionsModal from '../components/User-options-modal/UserOptionsModal';
import EditProfileModal from '../components/EditProfileModal/EditProfileModal'; 

import Carousel from '../components/Carousel/Carousel'

import { RecipeService } from '../services/apiService';
import { useNavigate } from 'react-router-dom';


export default function CreateRecipePage({ currentUser }) {
    // ESTADOS DE LAYOUT E PESQUISA (mantidos)
    const [isMobileSearchBarOpened, setIsMobileSearchBarOpened] = useState(false)
    const [searchText, setSearchText] = useState('')
    const navigate = useNavigate(); // Hook de navegação
    
    
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
    
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
   
    useEffect(() => {
        if (!imageFiles || imageFiles.length === 0) {
            setImagePreviews([]);
            return;
        }

        const objectUrls = Array.from(imageFiles).map(file => URL.createObjectURL(file));
        setImagePreviews(objectUrls);

        return () => {
            objectUrls.forEach(url => URL.revokeObjectURL(url));
        };

    }, [imageFiles]);

    const MAX_FILES = 5;

    const handleImageSelect = (e) => {
        const files = e.target.files;
        if (!files) return;

        let selectedFiles = Array.from(files);

        if (selectedFiles.length > MAX_FILES) {
                alert(`Você pode enviar no máximo ${MAX_FILES} imagens. As 5 primeiras foram selecionadas.`);
                selectedFiles = selectedFiles.slice(0, MAX_FILES)
        }

        setImageFiles(selectedFiles)
    }
    // 4. Função de Submissão (mantida)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData();

        formData.append('name', title);
        formData.append('description', description);
        formData.append('prepTime', prepTime);
        formData.append('portions', parseInt(servings));

        const ingredientsArray = ingredients;
        const instructionsArray = steps;
        const tagsArray = category.trim();

        formData.append('ingredients', ingredientsArray);
        formData.append('instructions', instructionsArray);
        formData.append('tags', tagsArray);
        
        // Anexa os arquivos de imagem 
        if (imageFiles && imageFiles.length > 0) {
            for (let i = 0; i < imageFiles.length; i++) {
                // O backend espera 'recipeImages'
                formData.append('recipeImages', imageFiles[i]); 
            }
        }

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
            searchBarHandle={mobileSearchBarHandle} 
            currentUser={currentUser}
            />
             
            <Navbar currentUser={currentUser} /> 
            
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
                        <div className="form-group-select">
                            <label htmlFor="category">Categoria</label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="custom-select" // Usaremos esta classe para estilizar
                                required
                            >
                                <option value="" disabled>Selecione uma categoria</option>
                                <option value="Salgados">Salgados</option>
                                <option value="Refeições">Refeições</option>
                                <option value="Doces">Doces</option>
                                <option value="Bebidas">Bebidas</option>
                                <option value="Veganos">Veganos</option>
                            </select>
                        </div>

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
                        {/* Container para a Pré-visualização (Carrossel) */}
                        <div className="form-group-carousel">
                            <label>Pré-visualização das Imagens (Máx: 5)</label>
                            
                            <Carousel images={imagePreviews} /> 
                        </div>
                        {/* Container para o Input de Upload */}
                        <div className="form-group-image">
                            <input 
                                type="file" 
                                id="image-upload" 
                                accept="image/*" 
                                multiple // Permite selecionar várias imagens
                                // O onChange agora atualiza 'imageFiles' (o que dispara o useEffect)
                                onChange={handleImageSelect} 
                            />
                            <label htmlFor="image-upload">
                                {imageFiles ? `(${imageFiles.length}) Imagens Selecionadas` : 'Adicionar Imagens'}
                            </label>
                        </div>
                        



                        {/* Botão de submissão */}
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Enviando...' : 'Enviar Receita para Análise'}
                        </Button>
                    </form>

                </div>
            </div>
            
        </div>
    );
}