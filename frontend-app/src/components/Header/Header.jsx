import logo from "../../assets/images/logo.png";
import { IoSearch } from "react-icons/io5";
import { IconContext } from "react-icons";
import UserAvatar from "../User-avatar/UserAvatar";
import UserDrawer from "../UserDrawer/UserDrawer";
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

export default function Header( {searchSetter, searchBarHandle} ) {
    return (
        <header className="header">
            <img className="logo-image-desktop" alt="Logo Image" src={logo} />
            <SearchBar searchSetter={searchSetter} />
            <SearchButton func={searchBarHandle}/>
            <div className="desktop-user-avatar">
                <UserDrawer/>
            </div>
        </header>
    )
}