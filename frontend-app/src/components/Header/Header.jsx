import logo from "../../assets/images/logo.png";
import logoMobile from '../../assets/images/logo-sem-txt.png'

import { IoSearch } from "react-icons/io5";

import { IconContext } from "react-icons";

import UserAvatar from "../User-avatar/UserAvatar";

import './Header.css'

function SearchBar( {searchSetter} ) {
    const searchHandle = () => {
        let text = document.getElementById('search-bar').value
        searchSetter(text)
    }

    return(
        <div className="search-bar">
            <input type="text" id="search-bar" className="search-bar-input" placeholder="Procure uma receita"/>
            <button className="search-bar-btn" onClick={searchHandle}>Procurar</button>
        </div>
    )
}

function SearchButton() {

    return(
        <button className="search-btn">
            <IconContext.Provider value={{ className: "search-btn-icon", size: '20px' }}>
                <IoSearch />
            </IconContext.Provider>
        </button>
    )
}

export default function Header( {searchSetter, userAvatarModalSituation, userAvatarModalHandle} ) {
    return (
        <header className="header">

            <img className="logo-image-desktop" alt="Logo Image" src={logo} />
            {/* <img className="logo-image-mobile" alt="Logo Image" src={logoMobile} /> */}
            <SearchBar searchSetter={searchSetter} />
            <SearchButton />
                {/* <button className="home-btn">
                    <IconContext.Provider value={{ className: "home-icon", color: "white", size:'30px' }}>
                        <IoHomeOutline />
                    </IconContext.Provider>
                    <p className="home-btn-label">
                        Home
                    </p>
                </button> */}
                
            <div className="desktop-user-avatar">
                <UserAvatar setter={userAvatarModalHandle} currentValue={userAvatarModalSituation}/>
            </div>
        </header>
    )
}