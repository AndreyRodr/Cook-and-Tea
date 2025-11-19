import { useState, useEffect } from 'react';
import { RecipeService } from '../../services/apiService';
import Button from '../Button/Button';
import InputBox from '../Input/InputBox';
import './EditRecipeModal.css'; 

// Props:
// - recipeToEdit: O objeto da receita com os dados atuais
// - onClose: Função para fechar o modal
// - onRecipeUpdated: Função para avisar a página 'Recipe.jsx' que os dados mudaram
export default function EditRecipeModal({ recipeToEdit, onClose, onRecipeUpdated }) {
    
    // Estado do formulário, pré-preenchido com os dados da receita
    const [name, setName] = useState(recipeToEdit.name || '');
    const [description, setDescription] = useState(recipeToEdit.description || '');
    const [prepTime, setPrepTime] = useState(recipeToEdit.prepTime || '');
    const [portions, setPortions] = useState(recipeToEdit.portions || '');
    const [ingredients, setIngredients] = useState(recipeToEdit.ingredients || ['']);
    const [instructions, setInstructions] = useState(recipeToEdit.instructions || ['']);
    const [tags, setTags] = useState(recipeToEdit.tags?.join(', ') || '');
    const [recipeImages, setRecipeImages] = useState([]); // Começa vazio, usuário adiciona NOVAS imagens
    
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Funções dinâmicas para listas (idênticas a CreateRecipePage)
    const handleAddField = (setter) => {
        setter(prev => [...prev, '']);
    };

    const handleRemoveField = (index, setter, getter) => {
        if (getter.length > 1) {
            setter(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleChangeField = (index, value, setter) => {
        setter(prev => prev.map((item, i) => (i === index ? value : item)));
    };

    const handleImageChange = (e) => {
        setRecipeImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('prepTime', prepTime);
            formData.append('portions', portions);
            formData.append('tags', tags);
            
            // Adiciona listas
            ingredients.forEach(ing => formData.append('ingredients[]', ing));
            instructions.forEach(inst => formData.append('instructions[]', inst));
            
            if (recipeImages.length > 0) {
                for (let i = 0; i < recipeImages.length; i++) {
                    formData.append('recipeImages', recipeImages[i]);
                }
            }
            
            // Chama o serviço de ATUALIZAÇÃO
            await RecipeService.updateRecipe(recipeToEdit.recipeId, formData);
            
            setIsLoading(false);
            alert("Receita atualizada com sucesso!");
            onRecipeUpdated(); 

        } catch (err) {
            console.error("Erro ao atualizar receita:", err);
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h2>Editar Receita</h2>
                
                <form onSubmit={handleSubmit} className="edit-recipe-form">
                    <div className="create-recipe-page" style={{ padding: 0 }}>
                        <div className="form-column">
                            <InputBox 
                                label="Nome da Receita" 
                                type="text" 
                                value={name} 
                                setter={setName} 
                                required 
                            />
                            
                            <label>Descrição</label>
                            <textarea 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                required 
                            />

                            <InputBox 
                                label="Tempo de Preparo (ex: 45 min)" 
                                type="text" 
                                value={prepTime} 
                                setter={setPrepTime} 
                                required 
                            />
                            
                            <InputBox 
                                label="Porções (ex: 4 porções)" 
                                type="text" 
                                value={portions} 
                                setter={setPortions} 
                                required 
                            />
                            
                            <InputBox 
                                label="Tags (separadas por vírgula)" 
                                type="text" 
                                value={tags} 
                                setter={setTags} 
                            />

                            <label>Novas Imagens (substituirão as antigas)</label>
                            <br />
                            <input 
                                type="file" 
                                multiple 
                                onChange={handleImageChange} 
                                accept="image/*"
                            />
                        </div>

                        <div className="form-column">
                            <label>Ingredientes</label>
                            {ingredients.map((ing, index) => (
                                <div key={index} className="dynamic-field">
                                    <input 
                                        type="text" 
                                        value={ing} 
                                        onChange={(e) => handleChangeField(index, e.target.value, setIngredients)} 
                                    />
                                    <button type="button" onClick={() => handleRemoveField(index, setIngredients, ingredients)}>-</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => handleAddField(setIngredients)} className="add-field-btn">+ Adicionar Ingrediente</button>
                            <br />
                            <label>Modo de Preparo</label>
                            {instructions.map((step, index) => (
                                <div key={index} className="dynamic-field">
                                    <textarea 
                                        value={step} 
                                        onChange={(e) => handleChangeField(index, e.target.value, setInstructions)} 
                                    />
                                    <button type="button" onClick={() => handleRemoveField(index, setInstructions, instructions)}>-</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => handleAddField(setInstructions)} className="add-field-btn">+ Adicionar Passo</button>
                        </div>
                    </div>
                    
                    <div className="form-actions">
                        <Button 
                            children={isLoading ? "Salvando..." : "Salvar Alterações"} 
                            type="submit" 
                            disabled={isLoading} 
                        />
                        {error && <p className="error-message">{error}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
}