import React, { useState, useEffect } from 'react'; // Importar useState e useEffect
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import CreateRecipePage from './pages/CreateRecipePage';
import Recipe from './pages/Recipe';
import RecipeListPage from './pages/RecipeListPage';
import { UserService } from './services/apiService'; // Importar o serviço

function App() {
  // 1. Mover o estado 'currentUser' para cá (de Home.jsx)
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Mover o useEffect para cá (de Home.jsx)
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Busca o usuário logado (usando o cookie)
        const user = await UserService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Não há usuário logado:", error.message);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  // 3. (Opcional) Função para atualizar o usuário após o login
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
  };

  // 4. Mostrar "Carregando..." enquanto o usuário é verificado
  if (isLoading) {
    return <div>Carregando aplicação...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* 5. Passar 'currentUser' como prop para todas as páginas */}
        <Route path="/" element={<Home currentUser={currentUser} />} />
        <Route path="/home" element={<Home currentUser={currentUser} />} />
        
        {/* Passamos o handler para o AuthPage atualizar o estado global */}
        <Route path="/auth" element={<AuthPage onAuthSuccess={handleAuthSuccess} />} />
        
        <Route path='/recipe-list/' element={<RecipeListPage currentUser={currentUser} />} />
        <Route path="/create-recipe" element={<CreateRecipePage currentUser={currentUser} />} />
        <Route path="/recipe/:id" element={<Recipe currentUser={currentUser} />} />
      </Routes>
    </Router>
  );
}

export default App;