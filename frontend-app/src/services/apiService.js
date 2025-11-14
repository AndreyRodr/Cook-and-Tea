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
    }
};