# 🍳 Cook n' Tea

**Cook n' Tea** is a team-built full stack recipe-sharing platform focused on discovering, publishing and interacting with culinary content.

The application supports different user roles, recipe management, ratings, favorites, image uploads and authenticated flows backed by a REST API.

![Cook n' Tea logo](frontend-app/src/assets/images/logo.png)

## ✨ Features

- User registration and login
- JWT-based authentication using cookies
- Common user and Chef roles
- Protected routes
- Profile editing
- Profile image upload to AWS S3
- Recipe creation, editing and deletion
- Up to 5 images per recipe
- Ingredients, preparation steps, portions, categories and cooking time
- Search by recipe name
- Browsing by category/tag
- Ratings
- Favorites

## 🧱 Architecture

The project is split into two main applications:

- **Frontend:** React + Vite
- **Backend:** Node.js + Express REST API

The backend uses **Sequelize** with **PostgreSQL** and stores uploaded images in **AWS S3**.

Authentication is handled with JWT tokens stored in cookies, and protected endpoints use authentication middleware. Chef-only recipe creation is also protected by role validation.

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- React Router
- Material UI / React Icons
- CSS

### Backend

- Node.js
- Express
- Sequelize
- PostgreSQL
- JWT
- bcrypt
- Multer
- AWS SDK / S3

## 📁 Project Structure

```text
Cook-and-Tea/
├── backend-api/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── utils/
│       └── server.js
│
└── frontend-app/
    ├── public/
    └── src/
        ├── assets/
        ├── components/
        ├── pages/
        └── services/
```

## ⚙️ Requirements

- Node.js
- npm
- PostgreSQL
- An AWS S3 bucket if image upload functionality is required

## 🔐 Environment Variables

Create a `.env` file inside:

```text
backend-api/src/
```

Example:

```env
PGHOST=localhost
PGDATABASE=cook_n_tea
PGUSER=postgres
PGPASSWORD=your_password

JWT_SECRET=your_jwt_secret
NODE_ENV=development

AWS_BUCKET_NAME=your_bucket_name
AWS_BUCKET_REGION=your_bucket_region
AWS_ACCESS_KEY=your_access_key
AWS_SECRET_KEY=your_secret_key
```

Do not commit real credentials or secrets.

## ▶️ Running Locally

The frontend and backend run separately.

### Backend

```bash
cd backend-api/src
npm install
node server.js
```

The API runs on:

```text
http://localhost:3001
```

### Frontend

Open another terminal:

```bash
cd frontend-app
npm install
npm run dev
```

The frontend is available by default at:

```text
http://localhost:5173
```

## 🔒 Authentication and Authorization

Passwords are hashed with **bcrypt** before being persisted.

The API validates JWT tokens from cookies through authentication middleware. Protected endpoints require a valid authenticated user, while recipe creation is additionally restricted to users with the Chef role.

## 🖼️ Image Storage

Recipe and profile images are uploaded to **AWS S3** using the AWS SDK.

Recipe routes currently accept up to **5 images** per recipe.

## 🧪 Development Status

This repository represents an academic team project and currently targets local development.

The backend CORS configuration currently points to the local frontend origin (`http://localhost:5173`), so a production deployment would require environment-based origin configuration and a review of cross-domain cookie settings.

## 👥 Team Project

Cook n' Tea was developed collaboratively as an academic project.

## 📄 License

Developed for educational purposes.
