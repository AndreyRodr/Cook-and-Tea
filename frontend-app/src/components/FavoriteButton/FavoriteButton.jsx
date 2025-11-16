import React, { useState, useEffect } from 'react';
import { UserService } from '../../services/apiService';
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


    const handleToggleFavorite = async () => {
        try{
            if(!isFavorite) {
                await UserService.addFavorite(recipeId)
                setIsFavorite(true)
            } else {
                await UserService.removeFavorite(recipeId)
                setIsFavorite(false)
            }
        } catch(err) {
            console.error(`Erro ao adicionar a receita aos favoritos: ${err}`);
        }
    };

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            try {
                const favoritesList = await UserService.getFavorites(); 

                const isAlreadyFavorite = favoritesList.some(
                    (recipe) => recipe.recipeId === recipeId
                );
                
                setIsFavorite(isAlreadyFavorite);

            } catch (err) {
                console.error("Erro ao verificar status de favorito:", err);
                setIsFavorite(initialState); 
            } 
        };

        checkFavoriteStatus();
        
    }, [recipeId, initialState]);

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