import React from 'react';
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
    const style = {
        width: size,
        height: size,
    };

    return (
        <div className="profile-avatar-container" style={style}>
            {imageUrl ? (
                <img src={imageUrl} alt={altText} className="profile-avatar-image" />
            ) : (
                // Fallback: Ícone de usuário
                <IconContext.Provider value={{ className: 'profile-avatar-fallback-icon', size: size }}>
                    <FaUserCircle />
                </IconContext.Provider>
            )}
        </div>
    );
}