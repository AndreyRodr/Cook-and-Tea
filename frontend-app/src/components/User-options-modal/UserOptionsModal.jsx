import './UserOptionsModal.css'
import { LuNotebookText } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { IconContext } from "react-icons";


export default function UserOptionsModal( {type} ) {
    return(
        <div className="input">
            <button className="value">
                <IconContext.Provider value={{className: 'userOptIcon', size:'15px'}}>
                    <FaRegUser/>
                </IconContext.Provider>
                Editar Perfil
            </button>
            {type === 'chefe' && 
                <button className="value">
                    <IconContext.Provider value={{className: 'userOptIcon', size:'15px'}}>
                        <LuNotebookText />
                    </IconContext.Provider>
                    Adicionar receita
                </button>
            }
        </div>
    )
}