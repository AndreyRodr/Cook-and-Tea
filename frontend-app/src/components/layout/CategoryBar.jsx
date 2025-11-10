// frontend-app/src/components/layout/CategoryBar.jsx
import React from 'react';
import './CategoryBar.css';

const categories = ['Sobremesas', 'Salgados', 'Bebidas'];

function CategoryBar() {
  return (
    <nav className="category-bar-container">
      <div className="category-bar-content">
        {categories.map((category) => (
          <button key={category} className="category-button">
            {category}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default CategoryBar;