import { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { IconContext } from "react-icons";
import './MobileSearchBar.css'

export default function MobileSearchBar( {searchSetter, isOpened} ) {
    
    const searchHandle = () => {
        let text = document.getElementById('search-bar').value
        searchSetter(text)
    }

    return (
        <>
            {isOpened &&
                <div className="mobile-search-bar">
                    <input type="text" id="search-bar" className="mobile-search-bar-input" placeholder="Procure uma receita"/>
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