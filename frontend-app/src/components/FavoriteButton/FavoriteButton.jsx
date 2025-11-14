import React, { useState } from 'react';
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import { IconContext } from "react-icons";
import './FavoriteButton.css';

/**
 * Botão de Curtida/Favorito com estado de alternância.
 *
 * @param {object} props - As propriedades do componente.
 * @param {number} props.recipeId - O ID da receita a ser favoritada.
 * @param {boolean} [props.initialState=false] - Define se a receita já está favoritada.
 */
export default function FavoriteButton({ recipeId, initialState = false }) {
    const [isFavorite, setIsFavorite] = useState(initialState);

    const handleToggleFavorite = () => {
        const newState = !isFavorite;
        setIsFavorite(newState);

        // Aqui você faria a chamada de API para adicionar/remover dos favoritos
        if (newState) {
            console.log(`Receita ${recipeId} adicionada aos favoritos!`);
            // Exemplo: API.addFavorite(recipeId);
        } else {
            console.log(`Receita ${recipeId} removida dos favoritos.`);
            // Exemplo: API.removeFavorite(recipeId);
        }
    };

    return (
        <button 
            className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
            onClick={handleToggleFavorite}
            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
            <IconContext.Provider value={{ size: '24px' }}>
                {isFavorite ? <IoIosHeart /> : <IoIosHeartEmpty />}
            </IconContext.Provider>
            <span className="favorite-text">
                {isFavorite ? 'Favorito' : 'Favoritar'}
            </span>
        </button>
    );
}