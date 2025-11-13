import { useState, useEffect } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { IoIosHeart } from "react-icons/io";
import { IconContext } from "react-icons";
import { RiAddBoxFill } from "react-icons/ri";

import './Navbar.css'

function NavbarElement( {txt, icon} ) {
    return(
        <button className="nav-element">
            {icon}
            <p>
                {txt}
            </p>
        </button>
    )
}

export default function Navbar( {userType} ) {
    const [isChef, setIsChef] = useState(false)

    useEffect(() => {
        if(userType === "chefe") {
            setIsChef(true)
        } else { 
            setIsChef(false)
        }
    }, [userType])

    return(
        <nav>
            <NavbarElement icon = {
                <IconContext.Provider value= {{ className: 'nav-element-icon', size:"18px" }}>
                    <IoHomeOutline />
                </IconContext.Provider>
            } txt="Home"/>
            <span></span>
            <NavbarElement icon = {
                <IconContext.Provider value= {{ className: 'nav-element-icon', size:"18px" }}>
                    <IoIosHeart />
                </IconContext.Provider>
            } txt="Favoritos"/>
            <span></span>
            {isChef &&
                <NavbarElement icon = {
                    <IconContext.Provider value= {{ className: 'nav-element-icon add-recipe-icon', size:"20px" }}>
                        <RiAddBoxFill />
                    </IconContext.Provider>
            } txt="Criar Receita"/>
            }
        </nav>
    )
}