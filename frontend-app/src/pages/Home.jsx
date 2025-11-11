import {useEffect, useState} from "react";
import bolo from "../assets/images/bolos.png";
import cha from "../assets/images/chas.png";
import comida from "../assets/images/comidas.png";
import hamburgers from "../assets/images/lanches.png";
import supreendase from "../assets/images/chef-blur.png";
import pudim from "../assets/images/pudim.png";
import "./Home.css";

import UserAvatar from "../components/User-avatar/UserAvatar";
import Header from "../components/Header/Header";
import UserOptionsModal from "../components/User-options-modal/UserOptionsModal";

export default function Home() {
    const [userOptionsModalIsOpened, setUserOptionsModalIsOpened] = useState(true)

    const [searchText, setSearchText] = useState('')
    const [loggedUserType, setLoggedUserType] = useState('chefe')

    return (
        <div className="home-container">
            <Header searchSetter={setSearchText} userAvatarModalSituation={userOptionsModalIsOpened} userAvatarModalHandle={setUserOptionsModalIsOpened}/>

            {/* <div className="content">
                <img className="hamburgers" alt="Hamburgers" src={hamburgers} />

                <img className="comida" alt="Comida" src={comida} />

                <img className="pudim" alt="Pudim" src={pudim} />

                <img className="cha" alt="Cha" src={cha} />

                <img className="bolo" alt="Bolo" src={bolo} />
            </div>

            <p className="text-wrapper">
                Bem-vindo ao CookN’Tea: o maior site de receitas da América Latina com
                muitas receitas! Aqui você encontra diversas receitas fáceis e rápidas
                para o seu dia a dia.
            </p>

            <img className="mask-group" alt="Mask group" src={supreendase} /> */}
            <div className="mobile-user-avatar">
                <UserAvatar setter={setUserOptionsModalIsOpened} currentValue={userOptionsModalIsOpened}/>
            </div>
            {!userOptionsModalIsOpened && <UserOptionsModal type="chefe"/>}
        </div>
    );
};