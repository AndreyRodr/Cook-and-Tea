import React, { useState, useEffect } from 'react';
import './EditRecipeModal.css';

import InputBox from '../Input/InputBox';
import Button from '../Button/Button';
import Carousel from '../Carousel/Carousel'; 
import { RecipeService } from '../../services/apiService';

export default function EditRecipeModal({ isOpen, onClose, recipeId, onRecipeUpdated }) {
    // Estados do Formulário
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [steps, setSteps] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [servings, setServings] = useState('');
    
    // Estados de Imagem e UI
    const [imageFiles, setImageFiles] = useState([]); 
    const [imagePreviews, setImagePreviews] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);

    // Categorias disponíveis (Opções)
    const categories = [
        "Bolos",
        "Bebidas",
        "Doces",
        "Lanches",
        "Prato Principal",
        "Outros"
    ];

    // Carregar dados ao abrir
    useEffect(() => {
        if (isOpen && recipeId) {
            const fetchRecipe = async () => {
                setIsLoading(true);
                try {
                    const data = await RecipeService.getRecipeById(recipeId);
                    
                    setTitle(data.name);
                    setDescription(data.description);
                    setPrepTime(data.prepTime);
                    setServings(data.portions);
                    
                    setIngredients(data.ingredients ? data.ingredients.join('\n') : '');
                    setSteps(data.instructions ? data.instructions.join('\n') : '');
                    
                    // Ajuste para pegar a primeira tag se for um array, ou a string direta
                    const tagValue = data.tags && data.tags.length > 0 ? data.tags[0] : '';
                    setCategory(tagValue);

                    if (data.recipeImages && data.recipeImages.length > 0) {
                        setImagePreviews(data.recipeImages.map(img => img.imageUrl));
                    } else {
                        setImagePreviews([]);
                    }
                    setImageFiles([]); 

                } catch (error) {
                    console.error("Erro ao carregar receita:", error);
                    alert("Erro ao carregar dados da receita.");
                    onClose();
                } finally {
                    setIsLoading(false);
                }
            };
            fetchRecipe();
        }
    }, [isOpen, recipeId]);

    // Efeito para preview de imagens
    useEffect(() => {
        if (!imageFiles || imageFiles.length === 0) return;

        const objectUrls = Array.from(imageFiles).map(file => URL.createObjectURL(file));
        setImagePreviews(objectUrls); 

        return () => {
            objectUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [imageFiles]);

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            alert("Máximo de 5 imagens.");
            setImageFiles(files.slice(0, 5));
        } else {
            setImageFiles(files);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('name', title);
        formData.append('description', description);
        formData.append('prepTime', prepTime);
        formData.append('portions', parseInt(servings));

        const ingredientsArray = ingredients.split('\n').filter(i => i.trim() !== '');
        const instructionsArray = steps.split('\n').filter(s => s.trim() !== '');
        // Envia a categoria selecionada como um array de tags
        const tagsArray = [category]; 

        formData.append('ingredients', JSON.stringify(ingredientsArray));
        formData.append('instructions', JSON.stringify(instructionsArray));
        formData.append('tags', JSON.stringify(tagsArray));

        if (imageFiles.length > 0) {
            imageFiles.forEach(file => formData.append('recipeImages', file));
        }

        try {
            await RecipeService.updateRecipe(recipeId, formData);
            alert("Receita atualizada com sucesso!");
            if (onRecipeUpdated) onRecipeUpdated();
            onClose();
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            alert(`Erro: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content-card" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Editar Receita</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <form className="edit-recipe-form" onSubmit={handleSave}>
                    
                    <InputBox label="Título" value={title} onChange={e => setTitle(e.target.value)} required />
                    

                    
                    <div className="form-group-textarea">
                        <label>Descrição</label>
                        <textarea className="custom-textarea" rows="3" value={description} onChange={e => setDescription(e.target.value)} required />
                    </div>

                    {/* 2. Categoria como Select (Opções) */}
                    <div className="form-group">
                        <label htmlFor="category-select">Categoria</label>
                        <select 
                            id="category-select"
                            value={category} 
                            onChange={e => setCategory(e.target.value)} 
                            className="custom-input" // Reutiliza o estilo do InputBox
                            required
                        >
                            <option value="" disabled>Selecione uma categoria</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="time-servings-group">
                        <InputBox label="Tempo (min)" value={prepTime} onChange={e => setPrepTime(e.target.value)} required />
                        <InputBox label="Porções" type="number" value={servings} onChange={e => setServings(e.target.value)} required />
                    </div>

                    <div className="form-group-textarea">
                        <label>Ingredientes (Um por linha)</label>
                        <textarea className="custom-textarea" rows="5" value={ingredients} onChange={e => setIngredients(e.target.value)} required />
                    </div>

                    <div className="form-group-textarea">
                        <label>Modo de Preparo (Um por linha)</label>
                        <textarea className="custom-textarea" rows="5" value={steps} onChange={e => setSteps(e.target.value)} required />
                    </div>

                    {/* 3. Input de Imagem movido para o final */}
                    <div className="form-group-image">
                        <label htmlFor="edit-image-upload" className="file-label">
                            {imageFiles.length > 0 
                                ? `(${imageFiles.length}) Novas Imagens Selecionadas` 
                                : 'Selecionar Novas Imagens (Substitui as atuais)'}
                        </label>
                        <div className="form-group-carousel">
                            <Carousel images={imagePreviews} />
                        </div>
                        <input 
                            type="file" 
                            id="edit-image-upload" 
                            accept="image/*" 
                            multiple 
                            onChange={handleImageSelect} 
                        />
                    </div>

                    <Button type="submit" className="save-button" disabled={isLoading}>
                        {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                </form>
            </div>
        </div>
    );
}