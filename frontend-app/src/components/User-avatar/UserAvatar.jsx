import { FaUserCircle } from "react-icons/fa";
import { IconContext } from "react-icons";
import './UserAvatar.css'

export default function UserAvatar( {profileImage} ){ 
    return( 
        <button className="user-avatar" >
            {/* Se a imagem (URL do S3) existir, mostre-a */}
            {profileImage ? (
                <img src={profileImage} alt="Foto de Perfil" />
            ) : (
                // Se não, mostre o ícone de fallback
                <IconContext.Provider value={{color: "var(--secondary-color)", className:"user-avata-icon", size:'60px'}}>
                    <FaUserCircle />
                </IconContext.Provider>
            )}
        </button>
    )
}