import { useEffect, useState } from "react";

import supreendase from "../assets/images/chef-blur.png";
import "./Home.css";

import UserAvatar from "../components/User-avatar/UserAvatar";
import Header from "../components/Header/Header";
import UserOptionsModal from "../components/User-options-modal/UserOptionsModal";
import FoodBanners from "../components/Food-banners/FoodBanners";
import InputBox from "../components/Input/InputBox";

export default function Home() {
    const [userOptionsModalIsOpened, setUserOptionsModalIsOpened] = useState(true)

    const [searchText, setSearchText] = useState('')
    const [loggedUserType, setLoggedUserType] = useState('chefe')

    return (
        <div className="home-container">
            <Header searchSetter={setSearchText} userAvatarModalSituation={userOptionsModalIsOpened} userAvatarModalHandle={setUserOptionsModalIsOpened} />
            <p className="text-wrapper">
                Bem-vindo ao CookN’Tea: o maior site de receitas da América Latina com
                muitas receitas! <br/>Aqui você encontra diversas receitas fáceis e rápidas
                para o seu dia a dia.
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
            {!userOptionsModalIsOpened && <UserOptionsModal type="chefe" />}
        </div>
    );
};