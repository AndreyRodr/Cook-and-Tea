import { useState, useEffect } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { IoIosHeart } from "react-icons/io";
import { IconContext } from "react-icons";
import { RiAddBoxFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { UserService } from "../../services/apiService";

import './Navbar.css'

function NavbarElement( {txt, icon, onClick} ) {
    return(
        <button className="nav-element" onClick={onClick}>
            {icon}
            <p>
                {txt}
            </p>
        </button>
    )
}

export default function Navbar( {currentUser} ) {
    const [isChef, setIsChef] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        if(currentUser){
            if(currentUser.type === 'chefe') {
                setIsChef(true)
            } else {
                setIsChef(false)
            }
        }
    }, [currentUser])

    const handleGoFavorites = () => {
        navigate(`/recipe-list?favorites=true`);
    }

    const handleGoHome = () => {
        navigate('/home'); 
    };
    
    const handleCreateRecipe = () => {
        navigate('/create-recipe');
    };

    return(
        <nav>
            <NavbarElement icon = {
                <IconContext.Provider value= {{ className: 'nav-element-icon', size:"18px" }}>
                    <IoHomeOutline />
                </IconContext.Provider>
            } txt="Home"
            onClick={handleGoHome} />
            <span></span>
            <NavbarElement icon = {
                <IconContext.Provider value= {{ className: 'nav-element-icon', size:"18px" }}>
                    <IoIosHeart />
                </IconContext.Provider>
            } txt="Favoritos"
            onClick={handleGoFavorites}/>
            <span></span>
            {isChef &&
                <NavbarElement icon = {
                    <IconContext.Provider value= {{ className: 'nav-element-icon add-recipe-icon', size:"20px" }}>
                        <RiAddBoxFill />
                    </IconContext.Provider>
            } txt="Criar Receita" 
            onClick={handleCreateRecipe}/>
            }
        </nav>
    )
}