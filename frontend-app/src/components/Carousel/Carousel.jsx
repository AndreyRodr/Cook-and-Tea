// andreyrodr/cook-and-tea/Cook-and-Tea-main/frontend-app/src/components/Carousel/Carousel.jsx

import React, { useState } from 'react';
import './Carousel.css'; // Estilos para o carrossel

export default function Carousel({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // ... (funções goToNext e goToPrevious inalteradas) ...
    const goToNext = () => {
        setCurrentIndex((prevIndex) => 
            (prevIndex === images.length - 1 ? 0 : prevIndex + 1)
        );
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => 
            (prevIndex === 0 ? images.length - 1 : prevIndex - 1)
        );
    };


    /* * CORREÇÃO: O return principal agora é o .carousel-container.
     * A lógica de "sem imagem" foi movida para dentro dele.
     */
    return (
        <div className="carousel-container">
            
            {/* Renderização condicional INTERNA */}
            {(!images || images.length === 0) ? (
                // Se não houver imagens, renderiza o placeholder
                <div className="carousel-placeholder">Nenhuma imagem disponível</div>
            ) : (
                // Se houver imagens, renderiza o carrossel
                <>
                    <button type="button" onClick={goToPrevious} className="carousel-button prev">&lt;</button>
                    <img 
                        src={images[currentIndex]} 
                        alt={`Imagem da receita ${currentIndex + 1}`} 
                        className="carousel-image" 
                    />
                    <button type="button" onClick={goToNext} className="carousel-button next">&gt;</button>
                    
                    <div className="carousel-dots">
                        {images.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                            ></span>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}