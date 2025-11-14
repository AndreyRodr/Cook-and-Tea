// src/pages/Recipe.jsx (MODIFICADO)

import Header from '../components/Header/Header'
import Navbar from '../components/Navbar/Navbar'
import UserAvatar from '../components/User-avatar/UserAvatar'
import MobileSearchBar from '../components/mobile-search-bar/MobileSearchBar'
import IngredientsList from '../components/IngredientsList/IngredientsList'
import { StarsRate, ReadOnlyStarsRate } from '../components/StarsRate/StarsRate'
import EditProfileModal from '../components/EditProfileModal/EditProfileModal';
import UserOptionsModal from '../components/User-options-modal/UserOptionsModal';
import Carousel from '../components/Carousel/Carousel';
import ProfileAvatar from '../components/ProfileAvatar/ProfileAvatar'
import FavoriteButton from '../components/FavoriteButton/FavoriteButton'

// 1. CORREÇÃO: Importar 'useEffect' do 'react' e 'useParams' do 'react-router-dom'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { RecipeService, UserService } from '../services/apiService'; // Importar os Serviços

import './Recipe.css'

export default function Recipe() {
    // Hooks
    const { id } = useParams(); // 2. Agora 'useParams' está definido (linha 22)
    
    // Estados de Layout (inalterados)
    const [userOptionsModalIsOpened, setUserOptionsModalIsOpened] = useState(true)
    const [isMobileSearchBarOpened, setIsMobileSearchBarOpened] = useState(false)
    const [editProfileModalIsOpened, setEditProfileModalIsOpened] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [loggedUserType, setLoggedUserType] = useState('comum') 

    // 3. Estados para os dados da API (Substituindo o mockRecipe)
    const [recipe, setRecipe] = useState(null);
    const [author, setAuthor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);


    // Handlers de Modal (inalterados)
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
        const fetchRecipeData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const recipeData = await RecipeService.getRecipeById(id);
                setRecipe(recipeData);

                if (recipeData.recipeImages && recipeData.recipeImages.length > 0) {
                    const urls = recipeData.recipeImages.map(
                        img => `${BASE_URL}/recipe-images/${img.imageId}`
                    );
                    setImageUrls(urls);
                }

                if (recipeData.authorId) {
                    const authorData = await UserService.getUserById(recipeData.authorId);
                    setAuthor(authorData);
                } else {
                    setAuthor({ name: 'Autor Desconhecido' }); // Fallback
                }
                
            } catch (err) {
                console.error("Erro ao buscar dados da receita:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecipeData();
    }, [id]); // Executa sempre que o ID na URL mudar

    // Função de formatação (inalterada)
    const formatInstructions = (steps) => (
        <ol>
            {steps.map((step, index) => (
                <li key={index}>{step}</li>
            ))}
        </ol>
    );
    
    // 5. Renderização condicional para Loading e Erro
    if (isLoading) {
        return (
            <div className="recipe-page">
                <Header searchSetter={setSearchText} searchBarHandle={mobileSearchBarHandle} />
                <Navbar userType={loggedUserType}/>
                <p style={{textAlign: 'center', fontSize: '1.5rem', padding: '50px', color: 'var(--primary-color)'}}>
                    Carregando receita... 🍳
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="recipe-page">
                <Header searchSetter={setSearchText} searchBarHandle={mobileSearchBarHandle} />
                <Navbar userType={loggedUserType}/>
                <p style={{textAlign: 'center', fontSize: '1.5rem', padding: '50px', color: 'red'}}>
                    Erro ao carregar receita: {error}
                </p>
            </div>
        );
    }

    // 6. Renderização principal (quando 'recipe' não é nulo)
    return(
        recipe && (
            <div className="recipe-page">
                <Header 
                    searchSetter={setSearchText} 
                    userAvatarModalSituation={userOptionsModalIsOpened} 
                    userAvatarModalHandle={setUserOptionsModalIsOpened} 
                    searchBarHandle={mobileSearchBarHandle}
                />
                <Navbar userType={loggedUserType}/>
                <MobileSearchBar searchSetter={setSearchText} isOpened={isMobileSearchBarOpened}/>
                
                <main>
                    <div className="left-content">
                        <div className="title-content">
                            <h1>{recipe.name}</h1>
                            <div className="rating-display">
                                <ReadOnlyStarsRate rate={recipe.starsAvg} />
                                <p>({recipe.avaliationsAmount} avaliações)</p>
                            </div>
                        </div>

                        <div className="recipe-details">
                            <div className='metadata-and-rating-column'>
                                <div className="metadata">
                                    <div className="author-info">
                                        <ProfileAvatar 
                                            imageUrl={author ? `${BASE_URL}/users/${author.userId}/profile-pic` : null}
                                            altText={`Foto de ${author?.name}`} 
                                            size="40px" 
                                        />
                                        <p><strong>Autor:</strong> {author?.name || 'Carregando...'}</p>
                                    </div>                           
                            
                                    <p><strong>Tempo de Preparo:</strong> {recipe.prepTime}</p>
                                    <p><strong>Porções:</strong> {recipe.portions}</p>
                                </div>

                                <div className='favorite-button-wrapper'>
                                    <FavoriteButton recipeId={recipe.recipeId} initialState={false}/>
                                </div>
                        
                                <div className="user-rating-section">
                                    <h3>Avalie esta receita!</h3>
                                    <StarsRate />
                                </div>
                            </div>

                            <Carousel images={imageUrls} />     
                        </div>

                        <article className="description">
                            <p>{recipe.description}</p>
                        </article>
                    </div>

                    <div className="right-content">
                        <div className="section-ingredients-section">
                            <h2>Ingredientes</h2>
                            <div className="list-container">
                                <IngredientsList ingredients={recipe.ingredients}/>
                            </div>
                        </div>
                        
                        <div className="section instructions-section">
                            <h2>Modo de preparo</h2>
                            <article className="instructions-text">
                                {formatInstructions(recipe.instructions)}
                            </article>
                        </div>
                    </div>
                </main>

                <div className="mobile-user-avatar">
                    <UserAvatar setter={setUserOptionsModalIsOpened} currentValue={userOptionsModalIsOpened} />
                </div>
                <EditProfileModal isOpen={editProfileModalIsOpened} onClose={closeEditProfileModal} userType={loggedUserType} />
                {!userOptionsModalIsOpened && <UserOptionsModal type={loggedUserType} onEditProfileClick={openEditProfileModal} />}
            </div>
        )
    )
}