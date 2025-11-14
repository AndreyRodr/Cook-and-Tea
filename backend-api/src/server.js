import express from 'express';
import apiRoutes from './routes/index.js'
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { connectDB, sequelize } from './config/database.js';

(async () => {
    try {
        await connectDB();
        
        await sequelize.sync({ force: true });
        console.log("Modelos sincronizados com o banco de dados.");

        const app = express();
        
        app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); 
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.setHeader('Access-Control-Allow-Credentials', true); 
            
            if (req.method === 'OPTIONS') {
                return res.sendStatus(200);
            }
            next();
        });
        
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cookieParser());
        
        app.use('/api', apiRoutes);
        
        app.listen(3001, ()=> {
            console.log(`🚀 Servidor rodando e ouvindo na porta http://localhost:3001`);
        });

    } catch(error) {
        console.error('Falha ao iniciar o servidor:', error);
        process.exit(1);
    }
})()