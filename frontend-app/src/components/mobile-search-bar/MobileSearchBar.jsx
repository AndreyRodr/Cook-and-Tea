
import { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { IconContext } from "react-icons";
import './MobileSearchBar.css'

import { useNavigate } from "react-router-dom";

export default function MobileSearchBar( {searchSetter, isOpened} ) {
    
    const navigate = useNavigate();

    const searchHandle = () => {
        let text = document.getElementById('search-bar').value
        searchSetter(text)

        if (text.trim() !== "") {
            navigate(`/recipe-list?favorites=false&?q=${encodeURIComponent(text)}`);
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            searchHandle();
        }
    }

    return (
        <>
            {isOpened &&
                <div className="mobile-search-bar">
                    <input 
                        type="text" 
                        id="search-bar" 
                        className="mobile-search-bar-input" 
                        placeholder="Procure uma receita"
                        onKeyDown={handleKeyDown} // 2. ADICIONE ESTA PROP
                    />
                    <button className="mobile-search-bar-btn" onClick={searchHandle}>
                        <IconContext.Provider value={{ className: "search-btn-icon", size: '20px' }}>
                            <IoSearch />
                        </IconContext.Provider>
                    </button>
                </div>
            }
        </>
    )
}