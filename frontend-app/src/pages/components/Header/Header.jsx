import logo from "../../../assets/images/logo.png";

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

export default function Header( {searchSetter} ) {
    return (
        <header className="header">
            <div className="left-content">
                <img className="logo-image" alt="Logo Image" src={logo} />
                <SearchBar searchSetter={searchSetter} />
            </div>
            <div className="desktop-user-avatar">
                <UserAvatar />
            </div>
        </header>
    )
}