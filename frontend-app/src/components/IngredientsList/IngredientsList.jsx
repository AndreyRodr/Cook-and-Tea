import './IngredientsList.css'
import { useEffect, useState } from 'react';
import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import Checkbox from '@mui/material/Checkbox';

function ListItem( {text} ) {
    const [checked, setChecked] = useState(false)

    const changeHandle = (e) => {
        setChecked(e.target.checked);
    }

    useEffect(() => {
        console.log(checked);
        
    },[checked])

    return(
        <li className="list-item">
            <Checkbox
                icon={<CircleOutlinedIcon />}
                checkedIcon={<CircleIcon 
                    />}
                sx={{
                    color: '#2A8B8F',
                    '&.Mui-checked': {
                    color: '#2A8B8F',
                    }
                }}
                onChange={changeHandle}
            />
            {!checked && <p className='list-item-text'>{text}</p>}
            {checked && <p className='list-item-text off'>{text}</p>}
        </li>
    )
}

export default function IngredientsList( {ingredients} ) {
    console.log(ingredients);
    
    return (
        <ul className='ingredients-list'>
            {ingredients.map((ing, index) => {
                return(
                    <ListItem key={index} text={ing}/>
                )
            })}
        </ul>
    )
}