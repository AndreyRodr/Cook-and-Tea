import { useState, useEffect } from 'react';
import UserAvatar from "../User-avatar/UserAvatar";
import { FaUserEdit, FaSignOutAlt } from 'react-icons/fa';
import './UserDrawer.css';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from '../EditProfileModal/EditProfileModal';
import { UserService, AuthService } from "../../services/apiService";


export default function UserDrawer( {currentUser} ) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLogged, setIsLogged] = useState(true)
    const [userPic, setUserPic] = useState('')
    const [loggedUserType, setLoggedUserType] = useState('chefe')

    const [editProfileModalIsOpened, setEditProfileModalIsOpened] = useState(false)

    const handleLogout = async () => {
        try {
            await AuthService.logout(); 
            window.location.href = '/home'; 
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            window.location.href = '/home';
        }
    };

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
                <UserAvatar profileImage={currentUser?.profilePicUrl} />
            </div>

            {isLogged &&
                <div className={`drawer-menu ${isOpen ? 'open' : ''}`}>
                    <ul>
                        <li onClick={openEditProfileModal} >
                            <FaUserEdit className="icon" />
                            <span>Editar Perfil</span>
                        </li>
                        <li onClick={handleLogout}>
                            <FaSignOutAlt className="icon" />
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