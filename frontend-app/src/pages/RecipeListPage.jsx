import Header from '../components/Header/Header'
import Navbar from '../components/Navbar/Navbar'
import MobileSearchBar from '../components/mobile-search-bar/MobileSearchBar'
import EditProfileModal from '../components/EditProfileModal/EditProfileModal'
import UserAvatar from '../components/User-avatar/UserAvatar'
import { ReadOnlyStarsRate } from '../components/StarsRate/StarsRate'

import { useState } from 'react'
import noImg from '../assets/images/noImg.jpg'
import { useEffect } from 'react'

import './RecipeListPage.css'

function RecipeElement( {recipe} ){
    const [recipeImage, setRecipeImage] = useState('')

    useEffect(()=> {
        if(!recipe.images[0]) {
            setRecipeImage(noImg)
        }
        else {
            setRecipeImage(recipe.images[0])
        }
    }, [recipe])

    return(
        <div className="recipe-element">
            <img src={recipeImage} alt="" />
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
        const [editProfileModalIsOpened, setEditProfileModalIsOpened] = useState(false)
        const [isMobileSearchBarOpened, setIsMobileSearchBarOpened] = useState(false)

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

        const [searchText, setSearchText] = useState('')

        const [loggedUserType, setLoggedUserType] = useState('chefe')


        const recipesExemple = [
            {
                recipeId: 1,
                name: 'bolo',
                description: 'asdasda',
                tags: ['doce'],
                images: [""],
                avaliationsAmount: 22,
                starsAvg: 3,
            },
            {
                recipeId: 2,
                name: 'bolo',
                description: 'asdasda',
                tags: ['doce'],
                images: [""],
                avaliationsAmount: 22,
                starsAvg: 3,
            },
        ]
    return (
        <div className="recipe-list-page">
            <Header
                searchSetter={setSearchText}
                searchBarHandle={mobileSearchBarHandle}
            />
            <Navbar userType="chefe" />
            <MobileSearchBar searchSetter={setSearchText} isOpened={isMobileSearchBarOpened} />
            <RecipeList recipes={recipesExemple}/>
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