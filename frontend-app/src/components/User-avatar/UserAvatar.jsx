import { FaUserCircle } from "react-icons/fa";
import { IconContext } from "react-icons";
import './UserAvatar.css'

export default function UserAvatar( {profileImage} ){ 

    return( 
        <button className="user-avatar" >
            {profileImage && <img src={profileImage} alt="" />}
        </button>
    )
}