import bolo from "../../assets/images/bolos.png";
import cha from "../../assets/images/chas.png";
import comida from "../../assets/images/comidas.png";
import hamburgers from "../../assets/images/lanches.png";
import pudim from "../../assets/images/pudim.png";
import './FoodBanners.css'

function FoodBanner({ img, text, route }) {
    return(
        <div className="banner suprise-banner">
            <img src={img} alt="" />
            <h1>{text}</h1>
        </div>
    )
}

export default function FoodBanners() {
    
    const banners = [
        {
            text: 'Lanches',
            img: hamburgers,
            route: ''
        },
        {
            text: 'Comidas',
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
            text: 'Bolos',
            img: bolo,
            route: ''
        },
    ]
    
    return(
        <div className="banners">
            {banners.map((banner) => {
                return(
                    <FoodBanner key={banners.indexOf(banner)} img={banner.img} text={banner.text} route={banner.route}/>
                )
            })}
        </div>
    )
}