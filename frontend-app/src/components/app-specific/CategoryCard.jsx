// frontend-app/src/components/app-specific/CategoryCard.jsx
import React from 'react';
import './CategoryCard.css';

function CategoryCard({ title, imageUrl, onClick }) {
  return (
    <div className="category-card" onClick={onClick}>
      <img src={imageUrl} alt={title} className="card-image" />
      <span className="card-title">{title}</span>
    </div>
  );
}

export default CategoryCard;