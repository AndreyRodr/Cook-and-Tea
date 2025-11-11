
import { FaUserCircle } from "react-icons/fa";
import { IconContext } from "react-icons";
import './UserAvatar.css'

export default function UserAvatar(){ 
    return( 
        <div className="user-avatar">
            <IconContext.Provider value={{color: "var(--secondary-color)", className:"user-avata-icon", size:'60px'}}>
                <FaUserCircle />
            </IconContext.Provider>
        </div>
    )
}