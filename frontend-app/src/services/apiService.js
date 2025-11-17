export const BASE_URL = 'http://localhost:3001/api'; 

/**
 * Função utilitária para chamadas fetch.
 * 'credentials: "include"' é essencial para enviar e receber cookies (JWT).
 */
const apiFetch = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
        credentials: 'include', // Necessário para cookies (JWT)
    });

    if (!response.ok) {
        // Tenta ler a mensagem de erro do backend
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido no servidor.' }));
        throw new Error(errorData.message || 'Falha na requisição.');
    }

    // Retorna a resposta, ignorando o corpo se for 204 No Content (DELETE)
    if (response.status === 204) {
        return null;
    }

    return response.json();
};

const apiFetchFormData = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        // Não definir 'Content-Type' para FormData; o browser faz isso automaticamente
        credentials: 'include', // Necessário para cookies (JWT)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido no servidor.' }));
        throw new Error(errorData.message || 'Falha na requisição.');
    }
    return response.json();
}

export const AuthService = {
    // POST /api/auth/login
    login: (email, password) => {
        return apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    // POST /api/users (Cadastro)
    register: (name, email, password, isChef) => {
        const type = isChef ? 'chefe' : 'comum';
        return apiFetch('/users', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, type }),
        });
    },

    logout: () => {
        return apiFetch('/auth/logout', {
            method: 'POST',
        });
    }
};

export const UserService = {
    // GET /api/users/current
    getCurrentUser: () => {
        return apiFetch('/users/current', {
            method: 'GET',
        });
    },
    
    // PUT /api/users/current
    updateProfile: (formData) => {
        return apiFetchFormData('/users/current', {
            method: 'PUT',
            body: formData,
        });
    },

    getUserById: (userId) => {
        return apiFetch(`/users/${userId}`, {
            method: 'GET',
        });
    },

    /**
     * @param {FormData} formData - O FormData com a foto de perfil.
     */
    uploadProfilePic: (formData) => {
        return apiFetchFormData('/users/current/profile-pic', {
            method: 'POST',
            body: formData,
        });
    },

    deleteProfilePic: () => {
        return apiFetch('/users/current/profile-pic', {
            method: 'DELETE',
        });
    },

    /**
     * Busca a lista de receitas favoritas do usuário logado
     * Rota: GET /api/users/current/favorites
     */
    getFavorites: () => {
        return apiFetch('/users/current/favorites', {
            method: 'GET',
        });
    },

    /**
     * Adiciona uma receita aos favoritos
     * Rota: POST /api/users/current/favorites
     */
    addFavorite: (recipeId) => {
        return apiFetch('/users/current/favorites', {
            method: 'POST',
            body: JSON.stringify({ recipeId }),
        });
    },

    /**
     * Remove uma receita dos favoritos
     * Rota: DELETE /api/users/current/favorites/:recipeId
     */
    removeFavorite: (recipeId) => {
        return apiFetch(`/users/current/favorites/${recipeId}`, {
            method: 'DELETE',
        });
    }
};

export const RecipeService = {
    
    /**
     * Busca receitas pelo nome (query).
     * Rota: GET /api/recipes/search?q=...
     */
    searchRecipes: (query) => {
        return apiFetch(`/recipes/search?q=${encodeURIComponent(query)}`, {
            method: 'GET',
        });
    },

    /**
     * Busca todas as receitas.
     * Rota: GET /api/recipes
     */
    getAllRecipes: () => {
        return apiFetch('/recipes', {
            method: 'GET',
        });
    },

    /**
     * @param {FormData} formData - O FormData com os dados da receita E os arquivos.
     */
    createRecipe: (formData) => {
        return apiFetchFormData('/recipes', {
            method: 'POST',
            body: formData,
        });
    },
    
    getRecipeById: (id) => {
        return apiFetch(`/recipes/${id}`, {
            method: 'GET',
        });
    },

    /**
     * BUSCA receitas que contenham {tag}
     * @param {string} tag 
     */
    getRecipesByTag: (tag) => {
        return apiFetch(`/recipes/tag/${tag}`, {
            method: 'GET',
        });
    },

    /**
     * ATUALIZA uma receita existente.
     * Rota: PUT /api/recipes/:id
     * @param {string} id - O ID da receita
     * @param {FormData} formData - O FormData com os dados (incluindo imagens)
     */
    updateRecipe: (id, formData) => {
        return apiFetchFormData(`/recipes/${id}`, {
            method: 'PUT',
            body: formData,
        });
    },

    /**
     * DELETA uma receita.
     * Rota: DELETE /api/recipes/:id
     */
    deleteRecipe: (id) => {
        return apiFetch(`/recipes/${id}`, {
            method: 'DELETE',
        });
    }
};

export const AvaliationService = {
    /**
     * Cria uma nova avaliação.
     * Rota: POST /api/avaliations
     */
    createAvaliation: (stars, recipeId) => {
        return apiFetch('/avaliations', {
            method: 'POST',
            body: JSON.stringify({ stars, recipeId }),
        });
    },
};