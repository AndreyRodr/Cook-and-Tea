// src/pages/RecipeListPage.jsx (ATUALIZADO)

import Header from '../components/Header/Header'
import Navbar from '../components/Navbar/Navbar'
import MobileSearchBar from '../components/mobile-search-bar/MobileSearchBar'
import UserAvatar from '../components/User-avatar/UserAvatar' // Para o UserDrawer mobile
import UserDrawer from '../components/UserDrawer/UserDrawer' // Para o mobile
import { ReadOnlyStarsRate } from '../components/StarsRate/StarsRate'

import { useState, useEffect } from 'react'
import noImg from '../assets/images/noImg.jpg'
import { useSearchParams, useNavigate } from 'react-router-dom'; // Adicionado useNavigate

import { RecipeService } from '../services/apiService'

import './RecipeListPage.css'

// 1. Componente RecipeElement (Lógica de navegação adicionada)
function RecipeElement( {recipe} ){
    const navigate = useNavigate();
    
    // Define a imagem (se houver) ou usa a imagem padrão
    // (O backend não retorna imagens na busca geral, então usará noImg)
    const recipeImage = (recipe.images && recipe.images[0]) ? recipe.images[0] : noImg;

    // Handler para navegar para a página da receita
    const handleRecipeClick = () => {
        navigate(`/recipe/${recipe.recipeId}`);
    };

    return(
        <div className="recipe-element" onClick={handleRecipeClick}> {/* Adicionado onClick */}
            <img src={recipeImage} alt={recipe.name} /> 
            <div className="info-content">
                <h3>{recipe.name}</h3>
                <p>{recipe.description}</p>
                <div className="avaliation-container">
                    <ReadOnlyStarsRate rate={recipe.starsAvg}/>
                    <p>({recipe.avaliationsAmount})</p>
                </div>
            </div>
        </div>
    )
}

function RecipeList( {recipes} ) {
    return(
        <div className="recipe-list">
            {recipes.map((recipe) => { // Removido 'index' como key
                return(
                    <RecipeElement key={recipe.recipeId} recipe={recipe}/>
                )
            })}
        </div>
    )
}

// 2. Recebe 'currentUser' do App.jsx
export default function RecipeListPage({ currentUser }) {
        const [searchParams] = useSearchParams(); 
        const searchTerm = searchParams.get('q'); 
        const favorites = searchParams.get('favorites'); 
    
        // Estados de Layout
        const [isMobileSearchBarOpened, setIsMobileSearchBarOpened] = useState(false)
        const [searchText, setSearchText] = useState('')

        // Estados dos Dados
        const [recipes, setRecipes] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState(null);

        const mobileSearchBarHandle = () => {
            setIsMobileSearchBarOpened(!isMobileSearchBarOpened)
        }

        // 3. useEffect para buscar dados da API
        useEffect(() => {
            const fetchRecipes = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    let fetchedRecipes;
                    
                    // Lógica para Favoritos (API não implementada, mas a lógica do frontend está aqui)
                    if (favorites === 'true') {
                        console.log('Buscando receitas favoritas...');
                        // No futuro: fetchedRecipes = await RecipeService.getFavorites();
                        // Por enquanto, mostraremos nenhuma receita para favoritos:
                        fetchedRecipes = []; 
                    
                    // Lógica de Busca (Se houver termo de busca ou se for nulo/vazio)
                    } else if (searchTerm || searchTerm === '') {
                        console.log(`Buscando receitas com o termo: "${searchTerm}"`);
                        // Rota: GET /api/recipes/search?q=...
                        fetchedRecipes = await RecipeService.searchRecipes(searchTerm);
                    
                    // Fallback (se nenhum parâmetro for passado)
                    } else {
                        console.log('Buscando todas as receitas (fallback)');
                        fetchedRecipes = await RecipeService.getAllRecipes();
                    }
                    
                    setRecipes(fetchedRecipes);
                } catch (err) {
                    console.error('Erro ao buscar receitas:', err.message);
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchRecipes();
        }, [searchTerm, favorites]); // Re-executa se a busca ou o filtro de favoritos mudar

    // Define o título da página
    const getPageTitle = () => {
        if (favorites === 'true') return 'Minhas Receitas Favoritas';
        if (searchTerm) return `Resultados para: "${searchTerm}"`;
        return 'Todas as Receitas';
    };

    return (
        <div className="recipe-list-page">
            <Header
                searchSetter={setSearchText} 
                searchBarHandle={mobileSearchBarHandle}
                currentUser={currentUser} // Passa o usuário
            />
            <Navbar currentUser={currentUser} /> {/* Passa o usuário */}
            <MobileSearchBar searchSetter={setSearchText} isOpened={isMobileSearchBarOpened} />
            
            <h1 style={{padding: '20px', color: 'var(--primary-color)'}}>
                {getPageTitle()}
            </h1>

            {/* 4. Renderização Condicional */}
            {isLoading && <p style={{textAlign: 'center', fontSize: '1.2rem'}}>Carregando receitas...</p>}
            {error && <p style={{textAlign: 'center', color: 'red'}}>Erro: {error}</p>}

            {!isLoading && !error && (
                <>
                    {recipes.length > 0 ? (
                        <RecipeList recipes={recipes}/>
                    ) : (
                        <p style={{textAlign: 'center', fontSize: '1.2rem'}}>Nenhuma receita encontrada.</p>
                    )}
                </>
            )}

            {/* Renderiza o drawer/avatar mobile */}
            <div className="mobile-user-avatar">
                <UserDrawer currentUser={currentUser} />
            </div>
        </div>
    )
}