// src/pages/Recipe.jsx (ATUALIZADO)

import Header from '../components/Header/Header'
import Navbar from '../components/Navbar/Navbar'
import UserAvatar from '../components/User-avatar/UserAvatar' // Para o UserDrawer mobile
import MobileSearchBar from '../components/mobile-search-bar/MobileSearchBar'
import IngredientsList from '../components/IngredientsList/IngredientsList'
import { StarsRate, ReadOnlyStarsRate } from '../components/StarsRate/StarsRate'
import EditProfileModal from '../components/EditProfileModal/EditProfileModal';
import UserDrawer from '../components/UserDrawer/UserDrawer' // Para o mobile
import Carousel from '../components/Carousel/Carousel';
import ProfileAvatar from '../components/ProfileAvatar/ProfileAvatar'
import FavoriteButton from '../components/FavoriteButton/FavoriteButton'

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'; // Hook para ler o :id da URL
import { RecipeService, UserService } from '../services/apiService'; // Serviços de API

import './Recipe.css'

// 1. Recebe 'currentUser' do App.jsx
export default function Recipe({ currentUser }) {
    // Hooks
    const { id } = useParams(); // Pega o ID da receita (ex: /recipe/1)
    
    // Estados de Layout (O UserDrawer mobile controla seus próprios modais)
    const [isMobileSearchBarOpened, setIsMobileSearchBarOpened] = useState(false)
    const [searchText, setSearchText] = useState('')

    // Estados para os dados da API
    const [recipe, setRecipe] = useState(null);
    const [author, setAuthor] = useState(null);
    const [imageUrls, setImageUrls] = useState([]); // Para o Carrossel
    const [authorImageUrl, setAuthorImageUrl] = useState(null); // Para o Avatar do Autor
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Handler da barra de pesquisa mobile
    const mobileSearchBarHandle = () => {
        setIsMobileSearchBarOpened(!isMobileSearchBarOpened)
    }

    // 2. useEffect para buscar dados da API quando o 'id' mudar
    useEffect(() => {
        const fetchRecipeData = async () => {
            if (!id) return; // Não faz nada se não houver ID

            setIsLoading(true);
            setError(null);
            try {
                // 1. Busca a receita principal
                const recipeData = await RecipeService.getRecipeById(id);
                setRecipe(recipeData);

                // 2. Processa as imagens do S3 para o Carrossel
                // (O backend envia 'recipeImages' com a URL)
                if (recipeData.recipeImages && recipeData.recipeImages.length > 0) {
                    const urls = recipeData.recipeImages.map(img => img.imageUrl);
                    setImageUrls(urls);
                }

                // 3. Busca o autor da receita
                if (recipeData.authorId) {
                    const authorData = await UserService.getUserById(recipeData.authorId);
                    setAuthor(authorData);
                    // Define a URL da foto de perfil do autor (vinda do S3)
                    setAuthorImageUrl(authorData.profilePicUrl); 
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
    }, [id]); 

    useEffect(()=> {
        console.log(author);
        
    }, [author])

    // Função de formatação (inalterada)
    const formatInstructions = (steps) => (
        <ol>
            {steps.map((step, index) => (
                <li key={index}>{step}</li>
            ))}
        </ol>
    );
    
    // 3. Renderização de Loading
    if (isLoading) {
        return (
            <div className="recipe-page">
                <Header 
                    searchSetter={setSearchText} 
                    searchBarHandle={mobileSearchBarHandle} 
                    currentUser={currentUser} // Passa o usuário para o Header
                />
                <Navbar currentUser={currentUser}/>
                <p style={{textAlign: 'center', fontSize: '1.5rem', padding: '50px', color: 'var(--primary-color)'}}>
                    Carregando receita... 🍳
                </p>
            </div>
        );
    }

    // 4. Renderização de Erro
    if (error) {
        return (
             <div className="recipe-page">
                <Header 
                    searchSetter={setSearchText} 
                    searchBarHandle={mobileSearchBarHandle} 
                    currentUser={currentUser}
                />
                <Navbar currentUser={currentUser}/>
                <p style={{textAlign: 'center', fontSize: '1.5rem', padding: '50px', color: 'red'}}>
                    Erro ao carregar receita: {error}
                </p>
            </div>
        );
    }

    // 5. Renderização Principal (quando 'recipe' existe)
    return(
        recipe && (
            <div className="recipe-page">
                <Header 
                    searchSetter={setSearchText} 
                    searchBarHandle={mobileSearchBarHandle}
                    currentUser={currentUser} // Passa o usuário para o Header
                />
                <Navbar currentUser={currentUser} />
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
                                    <div className="author-pic">
                                        <ProfileAvatar 
                                            imageUrl={authorImageUrl} // Usa a URL do S3
                                            altText={`Foto de ${author?.name}`} 
                                            size="100px" 
                                        />
                                    </div>
                                    <div className="author-info">
                                        <p><strong>Autor:</strong> {author?.name || 'Carregando...'}</p>
                                        <p><strong>Tempo de Preparo:</strong> {recipe.prepTime}</p>
                                        <p><strong>Porções:</strong> {recipe.portions}</p>
                                    </div>                           
                                </div>

                                <div className='favorite-button-wrapper'>
                                    <FavoriteButton recipeId={recipe.recipeId} initialState={false}/>
                                </div>
                        
                                <div className="user-rating-section">
                                    <h3>Avalie esta receita!</h3>
                                    <StarsRate />
                                </div>
                            </div>

                            <Carousel images={imageUrls} /> {/* Passa as URLs do S3 */}
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

                {/* Renderiza o drawer/avatar mobile (que controla seus próprios modais) */}
                <div className="mobile-user-avatar">
                    <UserDrawer currentUser={currentUser} />
                </div>
            </div>
        )
    )
}