import React, { useState } from 'react';
import './Carousel.css'; // Estilos para o carrossel

export default function Carousel({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Navega para a próxima imagem
    const goToNext = () => {
        setCurrentIndex((prevIndex) => 
            (prevIndex === images.length - 1 ? 0 : prevIndex + 1)
        );
    };

    // Navega para a imagem anterior
    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => 
            (prevIndex === 0 ? images.length - 1 : prevIndex - 1)
        );
    };

    if (!images || images.length === 0) {
        return <div className="carousel-placeholder">Nenhuma imagem disponível</div>;
    }

    return (
        <div className="carousel-container">
            <button onClick={goToPrevious} className="carousel-button prev">&lt;</button>
            <img 
                src={images[currentIndex]} 
                alt={`Imagem da receita ${currentIndex + 1}`} 
                className="carousel-image" 
            />
            <button onClick={goToNext} className="carousel-button next">&gt;</button>
            
            <div className="carousel-dots">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
}