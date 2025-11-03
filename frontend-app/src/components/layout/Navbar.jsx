// frontend-app/src/components/layout/Navbar.jsx
import React from 'react';
import { FaUserCircle, FaSearch } from 'react-icons/fa'; // Ícones
import './Navbar.css';

function Navbar() {
  const logoText = "Cook n' Tea"; // Pode ser um componente de Logo
  
  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <div className="navbar-logo">{logoText}</div>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="PROCURE UMA RECEITA"
            className="search-input"
          />
          <button className="search-button">PROCURAR</button>
        </div>
        
        <div className="navbar-profile">
          {/* O ícone de usuário é um excelente ponto de entrada para o Perfil.jsx */}
          <FaUserCircle className="profile-icon" />
        </div>
      </div>
    </header>
  );
}

export default Navbar;