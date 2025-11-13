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

function SearchButton( {func} ) {

    return(
        <button className="search-btn" onClick={func}>
            <IconContext.Provider value={{ className: "search-btn-icon", size: '20px' }}>
                <IoSearch />
            </IconContext.Provider>
        </button>
    )
}

export default function Header( {searchSetter, userAvatarModalSituation, userAvatarModalHandle, searchBarHandle} ) {
    return (
        <header className="header">
            <img className="logo-image-desktop" alt="Logo Image" src={logo} />
            <SearchBar searchSetter={searchSetter} />
            <SearchButton func={searchBarHandle}/>
            <div className="desktop-user-avatar">
                <UserAvatar setter={userAvatarModalHandle} currentValue={userAvatarModalSituation}/>
            </div>
        </header>
    )
}