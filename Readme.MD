# 🍳 Cook n' Tea

O **Cook n' Tea** é uma plataforma web interativa para compartilhamento e descoberta de receitas culinárias. O sistema permite que usuários se cadastrem, publiquem suas próprias receitas (se forem Chefs), avaliem pratos, favoritem suas escolhas preferidas e explorem um mundo de sabores.

![Logo](frontend-app/src/assets/images/logo.png)

## 📋 Funcionalidades

* **Autenticação de Usuários:** Login e Cadastro seguros com criptografia de senha e autenticação via JWT (Cookies).
* **Perfis de Usuário:**
    * **Usuário Comum:** Pode visualizar, buscar, favoritar e avaliar receitas.
    * **Chef:** Além das funções comuns, pode criar, editar e excluir suas próprias receitas.
    * Edição de perfil e upload de foto de perfil (armazenamento via AWS S3).
* **Gestão de Receitas:** Criação completa de receitas com lista de ingredientes, modo de preparo, tempo, porções, categorias e upload de múltiplas imagens.
* **Interação:**
    * Sistema de Avaliação (Média de Estrelas).
    * Sistema de Favoritos.
* **Busca e Filtros:** Barra de pesquisa por nome e navegação por categorias (Salgados, Doces, Veganos, etc.).

## 🚀 Tecnologias Utilizadas

### Frontend
* **React + Vite:** Framework e Build tool para alta performance.
* **React Router DOM:** Gerenciamento de rotas e navegação.
* **CSS Modules / Vanilla CSS:** Estilização personalizada.
* **React Icons & Material UI Icons:** Ícones e componentes visuais.

### Backend
* **Node.js + Express:** Servidor e API REST.
* **Sequelize (ORM):** Manipulação e modelagem do banco de dados.
* **PostgreSQL:** Banco de dados relacional.
* **JWT (JSON Web Token):** Segurança e controle de sessão via cookies.
* **AWS SDK (S3):** Armazenamento em nuvem para imagens de receitas e perfis.

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
* [Node.js](https://nodejs.org/)
* [PostgreSQL](https://www.postgresql.org/)

---

## 🔧 Configuração das Variáveis de Ambiente

O backend necessita de um arquivo `.env` para funcionar corretamente e conectar ao banco de dados e à AWS.

1.  Navegue até a pasta do backend: `backend-api/src`
2.  Crie um arquivo chamado `.env`.

Exemplo de `.env`:

```env
# Banco de Dados (PostgreSQL)
PGHOST=localhost
PGDATABASE=nome_do_banco
PGUSER=seu_usuario
PGPASSWORD=sua_senha

# Autenticação
JWT_SECRET=sua_chave_secreta
NODE_ENV=development

# AWS S3 (Imagens)
AWS_BUCKET_NAME=nome_do_bucket
AWS_BUCKET_REGION=regiao_do_bucket
AWS_ACCESS_KEY=sua_access_key
AWS_SECRET_KEY=sua_secret_key
```


## 🏃‍♂️ Como Rodar o Projeto
Para executar a aplicação, é necessário abrir dois terminais simultaneamente.

### Terminal 1: Backend (API)
Neste terminal, instalaremos as dependências do servidor e o iniciaremos.

```Bash```

#### Entre na pasta do código fonte do backend
```cd backend-api/src```

#### Instale as dependências
``` npm install ```

#### Inicie o servidor
``` node server.js ```

O servidor rodará na porta 3001.

### Terminal 2: Frontend (Aplicação Web)
Neste terminal, instalaremos as dependências da interface e iniciaremos o ambiente de desenvolvimento.

``` Bash ```

#### Entre na pasta do frontend
``` cd frontend-app ```

#### Instale as dependências
``` npm install ```

#### Inicie o projeto
``` npm run dev ```

A aplicação estará disponível geralmente em http://localhost:5173.

# 📂 Estrutura de Pastas
```cook-and-tea/
├── backend-api/           # Servidor e API
│   └── src/
│       ├── config/        # Conexão com Banco de Dados
│       ├── controllers/   # Lógica das rotas (Auth, Recipes, Users)
│       ├── middleware/    # Proteção de rotas
│       ├── models/        # Modelos Sequelize
│       ├── routes/        # Definição de endpoints da API
│       ├── utils/         # Serviços auxiliares (AWS S3, JWT)
│       └── server.js      # Ponto de entrada do servidor
│
└── frontend-app/          # Interface React
    ├── public/
    └── src/
        ├── assets/        # Imagens
        ├── components/    # Componentes Reutilizáveis (Navbar, Modais, Inputs)
        ├── pages/         # Páginas (Home, Recipe, Auth, CreateRecipe)
        └── services/      # Integração com a API
```

# 📝 Licença
Este projeto foi desenvolvido para fins educacionais.
