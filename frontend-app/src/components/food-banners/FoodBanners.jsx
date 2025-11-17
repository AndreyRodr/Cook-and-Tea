import bolo from "../../assets/images/bolos.png";
import cha from "../../assets/images/chas.png";
import comida from "../../assets/images/comidas.png";
import hamburgers from "../../assets/images/lanches.png";
import pudim from "../../assets/images/pudim.png";
import veg from '../../assets/images/prato-vegano-saudavel-.webp'
import './FoodBanners.css'

import { Link } from 'react-router-dom';

function FoodBanner({ img, text, route }) {
    return(
        <Link to={`/recipe-list?tag=${text}`} className="banner">
            <img src={img} alt="" />
            <h1>{text}</h1>
        </Link>
    )
}

export default function FoodBanners() {
    
    const banners = [
        {
            text: 'Salgados',
            img: hamburgers,
            route: ''
        },
        {
            text: 'Refeições',
            img: comida,
            route: ''
        },
        {
            text: 'Doces',
            img: pudim,
            route: ''
        },
        {
            text: 'Bebidas',
            img: cha,
            route: ''
        },
        {
            text: 'Veganos',
            img: veg,
            route: ''
        },
    ]
    
    return(
    <>
        <div className="banners">
            {banners.map((banner) => {
                return(
                    <FoodBanner key={banners.indexOf(banner)} img={banner.img} text={banner.text} route={banner.route}/>
                )
            })}
        </div>
    </>
    )
}