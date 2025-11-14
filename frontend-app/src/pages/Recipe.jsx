// src/pages/Recipe.jsx (MODIFICADO)

import Header from '../components/Header/Header'
import Navbar from '../components/Navbar/Navbar'
import UserAvatar from '../components/User-avatar/UserAvatar'
import MobileSearchBar from '../components/mobile-search-bar/MobileSearchBar'
import IngredientsList from '../components/IngredientsList/IngredientsList'
import { StarsRate, ReadOnlyStarsRate } from '../components/StarsRate/StarsRate'
import EditProfileModal from '../components/EditProfileModal/EditProfileModal';
import UserOptionsModal from '../components/User-options-modal/UserOptionsModal';
import Carousel from '../components/Carousel/Carousel'; // Importe o componente Carousel
import ProfileAvatar from '../components/ProfileAvatar/ProfileAvatar'
import FavoriteButton from '../components/FavoriteButton/FavoriteButton'

import { useState } from 'react'
import './Recipe.css'

export default function Recipe() {
    const [userOptionsModalIsOpened, setUserOptionsModalIsOpened] = useState(true)
    const [isMobileSearchBarOpened, setIsMobileSearchBarOpened] = useState(false)
    const [editProfileModalIsOpened, setEditProfileModalIsOpened] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [loggedUserType, setLoggedUserType] = useState('comum') // 'chefe' ou 'usuario'

    const openEditProfileModal = () => {
        setUserOptionsModalIsOpened(true);
        setEditProfileModalIsOpened(true);
    }

    const closeEditProfileModal = () => {
        setEditProfileModalIsOpened(false);
    }

    // NOVAS IMAGENS DE EXEMPLO para o carrossel
    const recipeImages = [
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Imagem de exemplo 1
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Imagem de exemplo 2
        'https://images.unsplash.com/photo-1512621776951-a5739858f2fc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'  // Imagem de exemplo 3
    ];


    // MOCK DATA (Simulação de dados da API)
    const mockRecipe = {
        recipeId: 101,
        name: 'Bolo de Chocolate Cremoso',
        author: 'Chef Andrey',
        rating: 4.5,
        avaliationCount: 42,
        description: 'Um bolo de chocolate incrivelmente úmido e cremoso, perfeito para qualquer ocasião. Fácil de fazer e irresistível! A receita utiliza ingredientes simples e pode ser adaptada com coberturas diversas.',
        prepTime: '30 min',
        portions: 8,
        ingredients: ['1 xícara de farinha', '1/2 xícara de cacau em pó', '1 xícara de açúcar', '2 ovos grandes', '1/2 xícara de leite', '1/4 xícara de óleo', '1 colher de chá de fermento'],
        instructions: ['Pré-aqueça o forno a 180°C.', 'Misture os ingredientes secos.', 'Adicione os ingredientes líquidos e bata bem.', 'Despeje a massa em uma forma untada.', 'Asse por 25 minutos ou até passar no teste do palito.'],
        images: recipeImages, // Usando o array de imagens para o carrossel
    };

    const mobileSearchBarHandle = () => {
        setIsMobileSearchBarOpened(!isMobileSearchBarOpened)
    }

    const formatInstructions = (steps) => (
        <ol>
            {steps.map((step, index) => (
                <li key={index}>{step}</li>
            ))}
        </ol>
    );
    
    return(
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
                        <h1>{mockRecipe.name}</h1>
                        <div className="rating-display">
                            <ReadOnlyStarsRate rate={mockRecipe.rating} />
                            <p>({mockRecipe.avaliationCount} avaliações)</p>
                        </div>
                    </div>

                    <div className="recipe-details">
                        <div className='metadata-and-rating-column'>
                            <div className="metadata">
                                <div className="author-info">
                                    <ProfileAvatar 
                                        imageUrl={mockRecipe.authorImageUrl} 
                                        altText={`Foto de ${mockRecipe.author}`} 
                                        size="40px" 
                                    />
                                    <p><strong>Autor:</strong> {mockRecipe.author}</p>
                                </div>                           
                         
                                <p><strong>Tempo de Preparo:</strong> {mockRecipe.prepTime}</p>
                                <p><strong>Porções:</strong> {mockRecipe.portions}</p>
                            </div>

                            <div className='favorite-button-wrapper'>
                                <FavoriteButton recipeId={mockRecipe.recipeId} initialState={false}/>
                            </div>
                    
                            <div className="user-rating-section">
                                <h3>Avalie esta receita!</h3>
                                <StarsRate />
                            </div>
                        </div>

                        {/* Substitui a imagem estática pelo Carrossel */}
                        <Carousel images={mockRecipe.images} />     
                    </div>

                    <article className="description">
                        <p>{mockRecipe.description}</p>
                    </article>


                </div>

                <div className="right-content">
                    <div className="section-ingredients-section">
                        <h2>Ingredientes</h2>
                        <div className="list-container">
                            <IngredientsList ingredients={mockRecipe.ingredients}/>
                        </div>
                    </div>
                    
                    <div className="section instructions-section">
                        <h2>Modo de preparo</h2>
                        <article className="instructions-text">
                            {formatInstructions(mockRecipe.instructions)}
                        </article>
                    </div>
                </div>
            </main>

            <div className="mobile-user-avatar">
                <UserAvatar setter={setUserOptionsModalIsOpened} currentValue={userOptionsModalIsOpened} />
            </div>

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
    )
}