import Header from '../components/Header/Header'
import Navbar from '../components/Navbar/Navbar'
import UserAvatar from '../components/User-avatar/UserAvatar'
import MobileSearchBar from '../components/mobile-search-bar/MobileSearchBar'
import IngredientsList from '../components/IngredientsList/IngredientsList'
import { StarsRate, ReadOnlyStarsRate } from '../components/StarsRate/StarsRate'
import CarouselComponent from '../components/CarouselComponent/CarouselComponent'

import { useState } from 'react'
import './Recipe.css'

export default function Recipe() {
    const [userOptionsModalIsOpened, setUserOptionsModalIsOpened] = useState(true)
    const [isMobileSearchBarOpened, setIsMobileSearchBarOpened] = useState(false)

    const [searchText, setSearchText] = useState('')

    const imgsEx = ['../assets/images/bolos.png', '../assets/images/chas.png']

    const mobileSearchBarHandle = () => {
        setIsMobileSearchBarOpened(!isMobileSearchBarOpened)
    }

    return(
        <div className="recipe-page">
            <Header 
                searchSetter={setSearchText} 
                userAvatarModalSituation={userOptionsModalIsOpened} 
                userAvatarModalHandle={setUserOptionsModalIsOpened} 
                searchBarHandle={mobileSearchBarHandle}
            />
            <Navbar userType="chefe"/>
            <MobileSearchBar searchSetter={setSearchText} isOpened={isMobileSearchBarOpened}/>
            <main>
                <div className="left-content">
                    <div className="title-content">
                        <h1>Nome da receita</h1>
                        <ReadOnlyStarsRate rate = {4}/>
                        <StarsRate />
                    </div>
                    <img src="" alt="" />
                    <article>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, error minus ea sequi nesciunt repudiandae deserunt culpa architecto voluptatum impedit dolore nulla labore molestiae quo saepe accusantium. Doloribus, voluptates incidunt.</article>
                </div>
                <div className="right-content">
                    <h1>Ingredientes</h1>
                    <div className="list-container">
                        <IngredientsList ingredients={['ovo', 'leite']}/>
                    </div>
                    <h1>Modo de preparo</h1>
                    <article>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque amet, molestiae nisi fugit voluptatibus aliquid quidem maxime numquam veniam nam saepe quas dicta corporis consectetur repellat et nobis nulla voluptatem!</article>
                </div>
            </main>

            <div className="mobile-user-avatar">
                <UserAvatar setter={setUserOptionsModalIsOpened} currentValue={userOptionsModalIsOpened} />
            </div>
            {!userOptionsModalIsOpened && <UserOptionsModal type="chefe" />}
        </div>
    )
}