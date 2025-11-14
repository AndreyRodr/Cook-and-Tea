import Header from '../components/Header/Header'
import Navbar from '../components/Navbar/Navbar'
import MobileSearchBar from '../components/mobile-search-bar/MobileSearchBar'
import EditProfileModal from '../components/EditProfileModal/EditProfileModal'
import UserAvatar from '../components/User-avatar/UserAvatar'
import { ReadOnlyStarsRate } from '../components/StarsRate/StarsRate'

import { useState, useEffect } from 'react'
import noImg from '../assets/images/noImg.jpg'
import { useSearchParams } from 'react-router-dom';

import { RecipeService } from '../services/apiService'

import './RecipeListPage.css'

// 1. CORREÇÃO NO RecipeElement (Removemos useState e useEffect)
function RecipeElement( {recipe} ){
    
    // Define a imagem diretamente. Se recipe.images[0] for "" (falsy), usa noImg.
    const recipeImage = (recipe.images && recipe.images[0]) ? recipe.images[0] : noImg;

    return(
        <div className="recipe-element">
            <img src={recipeImage} alt={recipe.name} /> {/* Usamos recipeImage diretamente */}
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
            {recipes.map((recipe, index) => {
                return(
                    <RecipeElement key={index} recipe={recipe}/>
                )
            })}
        </div>
    )
}

export default function RecipeListPage() {
        const [searchParams] = useSearchParams(); 
        const searchTerm = searchParams.get('q'); 
        const favorites = searchParams.get('favorites'); 
    
        const [editProfileModalIsOpened, setEditProfileModalIsOpened] = useState(false)
        const [isMobileSearchBarOpened, setIsMobileSearchBarOpened] = useState(false)
        const [searchText, setSearchText] = useState('')
        const [loggedUserType, setLoggedUserType] = useState('chefe')

        const [recipes, setRecipes] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState(null);


        const openEditProfileModal = () => {
            setUserOptionsModalIsOpened(true);
            setEditProfileModalIsOpened(true);
        }
    
        const closeEditProfileModal = () => {
            setEditProfileModalIsOpened(false);
        }
    
        const mobileSearchBarHandle = () => {
            setIsMobileSearchBarOpened(!isMobileSearchBarOpened)
        }

        useEffect(() => {
            const fetchRecipes = async () => {
                console.log(favorites);
                
                setIsLoading(true);
                setError(null);
                try {
                    let fetchedRecipes;
                    if (searchTerm) {
                        console.log(`Buscando receitas com o termo: ${searchTerm}`);
                        fetchedRecipes = await RecipeService.searchRecipes(searchTerm);
                    } else {
                        console.log('Buscando todas as receitas');
                        fetchedRecipes = await RecipeService.searchRecipes('');
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
        }, [searchTerm, favorites]);

    return (
        <div className="recipe-list-page">
            <Header
                searchSetter={setSearchText} 
                searchBarHandle={mobileSearchBarHandle}
            />
            <Navbar userType="chefe" />
            <MobileSearchBar searchSetter={setSearchText} isOpened={isMobileSearchBarOpened} />
            
            <h1 style={{padding: '20px', color: 'var(--primary-color)'}}>
                Resultados para: "{searchTerm || 'Todas as Receitas'}"
            </h1>

            {/* 4. RENDERIZAÇÃO CONDICIONAL */}
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

            <div className="mobile-user-avatar">
                <UserAvatar/>
            </div>
            <EditProfileModal
                isOpen={editProfileModalIsOpened}
                onClose={closeEditProfileModal}
                userType={loggedUserType}
            />
        </div>
    )
}