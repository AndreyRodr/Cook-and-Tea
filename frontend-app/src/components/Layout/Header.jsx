// frontend-app/src/components/layout/Header.jsx
import React from 'react';
import './Header.css'; // Estilo para o Header, se necessário

function Header() {
  return (
    <header className="app-header">
      {/* Aqui poderia ir um Logo, um NavMenu, etc.
          Para a imagem do banner, o HeroSection é o principal. */}
      {/* <nav>
        <img src="/path/to/logo.png" alt="Cook N' Tea Logo" className="logo" />
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/receitas">Receitas</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </nav> */}
    </header>
  );
}

export default Header;