import React, { useState, useEffect } from 'react';
import { FaUserCircle } from "react-icons/fa";
import { IconContext } from "react-icons";
import './ProfileAvatar.css';

/**
 * Componente de Avatar de Perfil Circular.
 *
 * @param {object} props - As propriedades do componente.
 * @param {string} [props.imageUrl] - URL da imagem de perfil. Se vazio, usa um ícone de fallback.
 * @param {string} [props.size='40px'] - Tamanho (largura e altura) do círculo do avatar.
 * @param {string} [props.altText='Foto de Perfil'] - Texto alternativo para a imagem.
 */
export default function ProfileAvatar({ imageUrl, size = '40px', altText = 'Foto de Perfil' }) {
    const [hasError, setHasError] = useState(false);
    
    const style = {
        width: size,
        height: size,
    };

    useEffect(() => {
        setHasError(false);
    }, [imageUrl]);

    const handleImageError = () => {
        setHasError(true);
    };

    return (
        <div className="profile-avatar-container" style={style}>
            {/* 5. Renderização condicional: Mostra imagem SÓ se a URL existir E não tiver dado erro */}
            {imageUrl && !hasError ? (
                <img 
                    src={imageUrl} 
                    alt={altText} 
                    className="profile-avatar-image" 
                    onError={handleImageError} // Chama o handler em caso de 404
                />
            ) : (
                // Fallback: Ícone de usuário
                <IconContext.Provider value={{ className: 'profile-avatar-fallback-icon', size: `calc(${size} * 0.8)` }}>
                    <FaUserCircle />
                </IconContext.Provider>
            )}
        </div>
    );
}