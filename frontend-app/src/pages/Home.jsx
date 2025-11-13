import { useEffect, useState } from "react";

import supreendase from "../assets/images/chef-blur.png";
import "./Home.css";

import UserAvatar from "../components/User-avatar/UserAvatar";
import Header from "../components/Header/Header";
import UserOptionsModal from "../components/User-options-modal/UserOptionsModal";
import FoodBanners from "../components/Food-banners/FoodBanners";

import Navbar from "../components/Navbar/Navbar";
import MobileSearchBar from "../components/mobile-search-bar/MobileSearchBar";

import EditProfileModal from "../components/EditProfileModal/EditProfileModal";



export default function Home() {
    const [userOptionsModalIsOpened, setUserOptionsModalIsOpened] = useState(true)
    const [isMobileSearchBarOpened, setIsMobileSearchBarOpened] = useState(false)

    const [searchText, setSearchText] = useState('')
    const [loggedUserType, setLoggedUserType] = useState('chefe')

    const [editProfileModalIsOpened, setEditProfileModalIsOpened] = useState(false)

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

    return (
        <div className="home-container">
            <Header 
                searchSetter={setSearchText} 
                userAvatarModalSituation={userOptionsModalIsOpened} 
                userAvatarModalHandle={setUserOptionsModalIsOpened} 
                searchBarHandle={mobileSearchBarHandle}
            />
            <Navbar userType="chefe"/>
            <MobileSearchBar searchSetter={setSearchText} isOpened={isMobileSearchBarOpened}/>
            <p className="text-wrapper">
                Bem-vindo ao Cook n’Tea: Uma pitada de sabor & Uma xícara de carinho! <br></br>Venha explorar receitas deliciosas e compartilhar momentos especiais conosco.
            </p>
            
            <FoodBanners />
            <div className="surprise-banner-container">
                <div className="banner surprise-banner">
                    <img src={supreendase}/>
                    <h1>Surpreenda-se</h1>
                </div>
            </div>

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
    );
};