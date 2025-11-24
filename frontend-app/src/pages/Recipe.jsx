import Header from '../components/Header/Header'
import Navbar from '../components/Navbar/Navbar'
import UserAvatar from '../components/User-avatar/UserAvatar'
import MobileSearchBar from '../components/mobile-search-bar/MobileSearchBar'
import IngredientsList from '../components/IngredientsList/IngredientsList'
import { StarsRate, ReadOnlyStarsRate } from '../components/StarsRate/StarsRate'
import EditProfileModal from '../components/EditProfileModal/EditProfileModal';
import UserDrawer from '../components/UserDrawer/UserDrawer'
import Carousel from '../components/Carousel/Carousel';
import ProfileAvatar from '../components/ProfileAvatar/ProfileAvatar'
import FavoriteButton from '../components/FavoriteButton/FavoriteButton'
import EditRecipeModal from '../components/EditRecipeModal/EditRecipeModal'
import Button from '../components/Button/Button'

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { RecipeService, UserService, AvaliationService } from '../services/apiService';

import './Recipe.css'

// 1. Recebe 'currentUser' do App.jsx
export default function Recipe({ currentUser }) {
    const { id } = useParams(); // Pega o ID da receita (ex: /recipe/1)
    const navigate = useNavigate();

    const [isMobileSearchBarOpened, setIsMobileSearchBarOpened] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Estados para os dados da API
    const [recipe, setRecipe] = useState(null);
    const [author, setAuthor] = useState(null);
    const [imageUrls, setImageUrls] = useState([]); // Para o Carrossel
    const [authorImageUrl, setAuthorImageUrl] = useState(null); // Para o Avatar do Autor
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [refreshTrigger, setRefreshTrigger] = useState(false);

    // Handler da barra de pesquisa mobile
    const mobileSearchBarHandle = () => {
        setIsMobileSearchBarOpened(!isMobileSearchBarOpened)
    }

    // busca dados da API quando o 'id' mudar
    useEffect(() => {
        const fetchRecipeData = async () => {
            if (!id) return; // Não faz nada se não houver ID

            if (!recipe) {
                setIsLoading(true);
            }
            setError(null);
            try {
                // Busca a receita principal
                const recipeData = await RecipeService.getRecipeById(id);
                setRecipe(recipeData);


                // Processa as imagens do S3 para o Carrossel
                if (recipeData.recipeImages && recipeData.recipeImages.length > 0) {
                    const urls = recipeData.recipeImages.map(img => img.imageUrl);
                    setImageUrls(urls);
                }

                // Busca o autor da receita
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
    }, [id, refreshTrigger]);

    const formatInstructions = (steps) => (
        <ol>
            {steps.map((step, index) => (
                <li key={index}>{step}</li>
            ))}
        </ol>
    );

    // Renderização de Loading
    if (isLoading && !recipe) { // Modificado para permitir refresh sem tela de loading
        return (
            <div className="recipe-page">
                <Header
                    searchSetter={setSearchText}
                    searchBarHandle={mobileSearchBarHandle}
                    currentUser={currentUser}
                />
                <Navbar currentUser={currentUser} />
                <p style={{ textAlign: 'center', fontSize: '1.5rem', padding: '50px', color: 'var(--primary-color)' }}>
                    Carregando receita... 🍳
                </p>
            </div>
        );
    }

    // Renderização de Erro
    if (error) {
        return (
            <div className="recipe-page">
                <Header
                    searchSetter={setSearchText}
                    searchBarHandle={mobileSearchBarHandle}
                    currentUser={currentUser}
                />
                <Navbar currentUser={currentUser} />
                <p style={{ textAlign: 'center', fontSize: '1.5rem', padding: '50px', color: 'red' }}>
                    Erro ao carregar receita: {error}
                </p>
            </div>
        );
    }

    // Handler para enviar a avaliação
    const handleRatingChange = async (event, newValue) => {
        // Verifica se o usuário está logado
        if (!currentUser) {
            alert("Você precisa estar logado para avaliar uma receita.");
            return;
        }

        const stars = newValue;

        try {
            // Tenta enviar a nova avaliação
            await AvaliationService.createAvaliation(stars, id); // 'id' é o recipeId
            alert("Obrigado pela sua avaliação!");

            setRefreshTrigger(prev => !prev);

        } catch (err) {
            console.error("Erro ao enviar avaliação:", err);
            alert(`Erro ao avaliar: ${err.message}`);
        }
    };

    const handleDeleteRecipe = async () => {
        const isConfirmed = window.confirm("Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita.");

        if (isConfirmed) {
            try {
                await RecipeService.deleteRecipe(id);
                alert("Receita excluída com sucesso.");
                navigate('/');
            } catch (err) {
                console.error("Erro ao excluir receita:", err);
                alert(`Erro ao excluir: ${err.message}`);
            }
        }
    };

    const handleRecipeUpdate = () => {
        setIsEditModalOpen(false); // Fecha o modal
        setRefreshTrigger(prev => !prev); // Aciona o refresh dos dados
    };

    const isOwner = currentUser && recipe && currentUser.userId === recipe.authorId;


    return (
        recipe && (
            <div className="recipe-page">
                <Header
                    searchSetter={setSearchText}
                    searchBarHandle={mobileSearchBarHandle}
                    currentUser={currentUser} // Passa o usuário para o Header
                />
                <Navbar currentUser={currentUser} />
                <MobileSearchBar searchSetter={setSearchText} isOpened={isMobileSearchBarOpened} />
                

                <main>
                    <div className="left-content">
                        <div className="title-content">
                            <h1>{recipe.name}</h1>
                            <div className="rating-display">
                                <ReadOnlyStarsRate rate={recipe.starsAvg} />
                                <p>({recipe.avaliationsAmount} avaliações)</p>
                                {isOwner && (
                                    <div className="recipe-owner-actions-inline">
                                        <Button
                                            onClick={() => setIsEditModalOpen(true)}  
                                            className="edit-btn small-btn"
                                        >
                                            Editar Receita
                                        </Button>


                                        <Button 
                                            onClick={handleDeleteRecipe} 
                                            className="danger-btn small-btn" 
                                        >
                                            Excluir Receita
                                        </Button>
                                    </div>
                                )}
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
                                    <FavoriteButton recipeId={recipe.recipeId} initialState={false} />
                                </div>

                                <div className="user-rating-section">
                                    <h3>Avalie esta receita!</h3>
                                    <StarsRate
                                        onChange={handleRatingChange}
                                        disabled={!currentUser}
                                    />
                                    {!currentUser && (
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            Você precisa estar logado para avaliar.
                                        </p>
                                    )}
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
                                <IngredientsList ingredients={recipe.ingredients} />
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
                {isOwner && (
                    <div className="recipe-owner-actions-mobile">
                        <Button onClick={() => setIsEditModalOpen(true)}>Editar</Button>
                        <Button onClick={handleDeleteRecipe} className="danger-btn">Excluir</Button>
                    </div>
                )}

                {/* Renderiza o drawer/avatar mobile (que controla seus próprios modais) */}
                {isOwner &&
                    <div className="mobile-user-avatar r-page">
                        <UserDrawer currentUser={currentUser} isRecipePage = {true}/>
                    </div>
                }

                {!isOwner &&
                    <div className="mobile-user-avatar">
                        <UserDrawer currentUser={currentUser} isRecipePage = {true}/>
                    </div>
                }

                {isEditModalOpen && (
                    <EditRecipeModal
                        isOpen={isEditModalOpen}
                        recipeId={recipe.recipeId}
                        onClose={() => setIsEditModalOpen(false)}
                        onRecipeUpdated={handleRecipeUpdate}
                    />
                )}
            </div>
        )
    )
}