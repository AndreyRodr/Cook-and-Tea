import { FaUserCircle } from "react-icons/fa";
import { IconContext } from "react-icons";
import './UserAvatar.css'

import booleanStateHandle from "../../utils/booleanStateHandle";

export default function UserAvatar( {setter, currentValue} ){ 

    return( 
        <button className="user-avatar" onClick={() => booleanStateHandle(setter, currentValue)}>
            <IconContext.Provider value={{color: "var(--secondary-color)", className:"user-avata-icon", size:'60px'}}>
                <FaUserCircle />
            </IconContext.Provider>
        </button>
    )
}