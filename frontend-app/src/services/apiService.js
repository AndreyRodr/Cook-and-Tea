const BASE_URL = 'http://localhost:3001/api'; 

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
        // O body já é um FormData, não precisa de JSON.stringify
        // As headers são omitidas de propósito
        credentials: 'include', 
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido no servidor.' }));
        throw new Error(errorData.message || 'Falha na requisição de upload.');
    }
    if (response.status === 204) {
        return null;
    }
    return response.json();
};

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
    updateProfile: (data) => {
        return apiFetch('/users/current', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    getUserById: (userId) => {
        return apiFetch(`/users/${userId}`, {
            method: 'GET',
        });
    },
    
    uploadProfilePic: (formData) => {
        return apiFetchFormData('/users/current/profile-pic', {
            method: 'POST',
            body: formData,
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
    createRecipe: (recipeData) => {
        return apiFetchFormData('/recipes', {
            method: 'POST',
            body: formData,
        });
    },
    
    getRecipeById: (id) => {
        return apiFetch(`/recipes/${id}`, {
            method: 'GET',
        });
    }
};