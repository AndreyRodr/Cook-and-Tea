import express from 'express';
import apiRoutes from './routes/index.js'
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { connectDB } from './config/database.js';


connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', apiRoutes);

app.listen(3001, ()=> {
    console.log(`🚀 Servidor rodando e ouvindo na porta http://localhost:3001`);
})