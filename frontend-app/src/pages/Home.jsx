import { useEffect, useState } from "react";
import {Link, useNavigate, useNavigationType} from 'react-router-dom'
import supreendase from "../assets/images/chef-blur.png";
import "./Home.css";

import UserAvatar from "../components/User-avatar/UserAvatar";
import Header from "../components/Header/Header";
import UserOptionsModal from "../components/User-options-modal/UserOptionsModal";
import FoodBanners from "../components/Food-banners/FoodBanners";
import UserDrawer from "../components/UserDrawer/UserDrawer";
import Navbar from "../components/Navbar/Navbar";
import MobileSearchBar from "../components/mobile-search-bar/MobileSearchBar";

import EditProfileModal from "../components/EditProfileModal/EditProfileModal";
import { RecipeService, UserService } from "../services/apiService";

export default function Home({ currentUser }) {
    const [userOptionsModalIsOpened, setUserOptionsModalIsOpened] = useState(true)
    const [isMobileSearchBarOpened, setIsMobileSearchBarOpened] = useState(false)
    const [searchText, setSearchText] = useState('')

    const navigate = useNavigate()

    const mobileSearchBarHandle = () => {
        setIsMobileSearchBarOpened(!isMobileSearchBarOpened)
    }

    const handleSurpriseClick = async () => {
        try {
            const data = await RecipeService.getAllRecipes();
            console.log(data);
            
            if(data && data.length > 0) {
                const recipes = data;
                console.log(recipes);
                
                const randomIndex = Math.floor(Math.random()*recipes.length);
                const randomRecipeId = recipes[randomIndex].recipeId;

                navigate(`/recipe/${randomRecipeId}`);
            } else {
                console.warn("Nenhuma receita encontrada para 'Surpreenda-se'");
            }  
        } catch (error) {
            console.error("Erro ao buscar receita aleatória:", error);
        }
    }

    return (
        <div className="home-container">
            <Header
                searchSetter={setSearchText}
                searchBarHandle={mobileSearchBarHandle}
                currentUser = {currentUser}
            />
            <Navbar currentUser={currentUser} />

            <MobileSearchBar searchSetter={setSearchText} isOpened={isMobileSearchBarOpened} />
            <p className="text-wrapper">
                Bem-vindo ao Cook n’Tea: Uma pitada de sabor & Uma xícara de carinho!
            </p>

            <FoodBanners />
            <div className="surprise-banner-container">
                <div className="banner surprise-banner" onClick={handleSurpriseClick}>
                    <img src={supreendase} />
                    <h1>Surpreenda-se</h1>
                </div>
            </div>

            <div className="mobile-user-avatar">
                <UserDrawer currentUser={currentUser}/>
            </div>

        </div>
    );
};