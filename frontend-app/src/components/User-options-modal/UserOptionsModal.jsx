import './UserOptionsModal.css'
import { LuNotebookText } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { IconContext } from "react-icons";
import { useNavigate } from 'react-router-dom';


// 1. Adicione a prop onEditProfileClick
export default function UserOptionsModal( {type, onEditProfileClick} ) { 
    const navigate = useNavigate();

    const handleCreateRecipeClick = () => {
        navigate('/create-recipe');
    }

    return(
        <div className="input">
            <button 
                className="value"
                onClick={onEditProfileClick} // 2. Adicione o manipulador de clique aqui
            >
                <IconContext.Provider value={{className: 'userOptIcon', size:'15px'}}>
                    <FaRegUser/>
                </IconContext.Provider>
                Editar Perfil
            </button>

            {type === 'chefe' && 
                <button 
                    className="value"
                    onClick={handleCreateRecipeClick}
                >
                    <IconContext.Provider value={{className: 'userOptIcon', size:'15px'}}>
                        <LuNotebookText />
                    </IconContext.Provider>
                    Adicionar receita
                </button>
            }
        </div>
    )
}