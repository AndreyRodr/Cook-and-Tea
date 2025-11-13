import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import CreateRecipePage from './pages/CreateRecipePage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/create-recipe" element={<CreateRecipePage />} />
        {/* Defina outras rotas aqui */}
      </Routes>
    </Router>
  );
}

export default App;