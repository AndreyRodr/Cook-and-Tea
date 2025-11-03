// frontend-app/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
// Importe outras páginas aqui

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Defina outras rotas aqui */}
      </Routes>
    </Router>
  );
}

export default App;