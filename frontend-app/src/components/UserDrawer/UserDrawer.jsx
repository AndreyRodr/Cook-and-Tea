import { useState, useEffect } from 'react';
import UserAvatar from "../User-avatar/UserAvatar";
import { FaUserEdit, FaPlus } from 'react-icons/fa'; // Exemplo de ícones
import './UserDrawer.css'; // Importando o CSS abaixo
import { Navigate, useNavigate } from 'react-router-dom';
import EditProfileModal from '../EditProfileModal/EditProfileModal';
import { UserService } from "../../services/apiService";

const BASE_URL = 'http://localhost:3001/api'; 

export default function UserDrawer( {currentUser} ) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLogged, setIsLogged] = useState(true)
    const [userPic, setUserPic] = useState('')
    const [loggedUserType, setLoggedUserType] = useState('chefe')

    const [editProfileModalIsOpened, setEditProfileModalIsOpened] = useState(false)

    useEffect(() => {
        if(currentUser) {
            setIsLogged(true)
        } else{
            setIsLogged(false)
        }
    }, [currentUser])

    const openEditProfileModal = () => {
        setEditProfileModalIsOpened(true);
    }

    const closeEditProfileModal = () => {
        setEditProfileModalIsOpened(false);
    }

    const navigate = useNavigate()

    const handleGoAuth = () => {
        navigate('/auth')
    }

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="user-menu-container">
            <div className="avatar-wrapper" onClick={toggleMenu}>
                <UserAvatar profileImage={currentUser ? `${BASE_URL}/users/${currentUser.userId}/profile-pic` : null} />
            </div>

            {isLogged &&
                <div className={`drawer-menu ${isOpen ? 'open' : ''}`}>
                    <ul>
                        <li onClick={openEditProfileModal} >
                            <FaUserEdit className="icon" />
                            <span>Editar Perfil</span>
                        </li>
                        <li onClick={() => console.log('Adicionar')}>
                            <FaPlus className="icon sair" />
                            <span>Sair</span>
                        </li>
                    </ul>
                </div>
            }
            {!isLogged &&
                <div className={`drawer-menu ${isOpen ? 'open' : ''}`}>
                    <ul>
                        <li onClick={handleGoAuth}>
                            <FaUserEdit className="icon" />
                            <span>Fazer Login</span>
                        </li>
                    </ul>
                </div>
            }
            <EditProfileModal
                isOpen={editProfileModalIsOpened}
                onClose={closeEditProfileModal}
                userType={loggedUserType}
            />
        </div>
    );
}