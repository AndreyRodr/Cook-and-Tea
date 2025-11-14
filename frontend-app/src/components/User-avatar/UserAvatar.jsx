import { FaUserCircle } from "react-icons/fa";
import { IconContext } from "react-icons";
import './UserAvatar.css'

import booleanStateHandle from "../../utils/booleanStateHandle";

export default function UserAvatar(){ 

    return( 
        <button className="user-avatar" >
            <IconContext.Provider value={{color: "var(--secondary-color)", className:"user-avata-icon", size:'60px'}}>
                <FaUserCircle />
            </IconContext.Provider>
        </button>
    )
}