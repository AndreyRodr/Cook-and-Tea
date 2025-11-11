import React from "react";
import bolo from "../assets/images/bolos.png";
import cha from "../assets/images/chas.png";
import comida from "../assets/images/comidas.png";
import hamburgers from "../assets/images/lanches.png";
import logo from "../assets/images/logo.png";
import supreendase from "../assets/images/chef-blur.png";
import pudim from "../assets/images/pudim.png";
import "./Home.css";

export default function Home() {
    return (
        <div className="home-container">
            <div className="content">
                <img className="hamburgers" alt="Hamburgers" src={hamburgers} />

                <img className="comida" alt="Comida" src={comida} />

                <img className="pudim" alt="Pudim" src={pudim} />

                <img className="cha" alt="Cha" src={cha} />

                <img className="bolo" alt="Bolo" src={bolo} />
            </div>

            <p className="text-wrapper">
                Bem-vindo ao CookN’Tea: o maior site de receitas da América Latina com
                muitas receitas! Aqui você encontra diversas receitas fáceis e rápidas
                para o seu dia a dia.
            </p>

            <div className="nav">
                <div className="rectangle" />

                <div className="div">Sobremesas</div>

                <div className="text-wrapper-2">Salgados</div>

                <div className="text-wrapper-3">Bebidas</div>

            </div>

            <header className="header">
                <img className="image" alt="Image" src={logo} />

                <div className="group">
                    {/* <img className="rectangle-2" alt="Rectangle" src={rectangle3} /> */}

                    <div className="text-wrapper-4">PROCURE UMA RECEITA</div>

                    <div className="tipo" />

                    <div className="text-wrapper-5">PROCURAR</div>
                </div>
            </header>

            {/* <img
                className="user-svgrepo-com"
                alt="User svgrepo com"
                src={userSvgrepoCom2}
            /> */}


            <img className="mask-group" alt="Mask group" src={supreendase} />
        </div>
    );
};