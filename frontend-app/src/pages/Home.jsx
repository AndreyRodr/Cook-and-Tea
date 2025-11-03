import React from 'react';
// Correção de capitalização: de 'Layout' para 'layout'
import Navbar from '../components/Layout/Navbar';
import CategoryBar from '../components/Layout/CategoryBar';
import CategoryCard from '../components/app-specific/CategoryCard';
import './Home.css';

// IMPORTANTE: Em um projeto real, você importaria as imagens assim:
/*
import lanchesImg from '../assets/images/lanches.png';
import comidasImg from '../assets/images/comidas.png';
// ... e usaria lanchesImg na propriedade imageUrl.
// Para este exemplo, usarei caminhos absolutos baseados na pasta /public
*/

const categoriesData = [
  // Assumindo que as imagens são colocadas na pasta public/assets/images
  { title: 'Lanches', imageUrl: '/assets/images/lanches.png' },
  { title: 'Comidas', imageUrl: '/assets/images/comidas.png' },
  { title: 'Sobremesas', imageUrl: '/assets/images/pudim.png' },
  { title: 'Chás', imageUrl: '/assets/images/chas.png' },
  { title: 'Bolos', imageUrl: '/assets/images/bolos.png' },
];

function Home() {
  const handleCardClick = (title) => {
    console.log(`Navegar para receitas de ${title}`);
    // Implementar a navegação aqui
  };

  return (
    <div className="home-page-container">
      <Navbar />
      <CategoryBar />
      
      <main className="home-main-content">
        <p className="welcome-text">
          Bem-vindo ao Cook N' Tea: o maior site de receitas da América Latina com muitas receitas! 
          Aqui você encontra diversas receitas fáceis e rápidas para o seu dia a dia.
        </p>

        <section className="category-cards-section">
          {categoriesData.map((data, index) => (
            <CategoryCard
              key={index}
              title={data.title}
              imageUrl={data.imageUrl}
              onClick={() => handleCardClick(data.title)}
            />
          ))}
        </section>

        <section className="surprise-banner">
          <h2 className="surprise-text">Surpreenda-se</h2>
        </section>

      </main>
      
      {/* Footer seria adicionado aqui */}
    </div>
  );
}

export default Home;
