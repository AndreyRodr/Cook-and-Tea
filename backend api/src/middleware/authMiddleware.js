import jwt from 'jsonwebtoken';
import 'dotenv/config';
import User from '../models/userModel.js';

/**
 * @desc    Middleware para proteger rotas.
 * Verifica o token JWT no cookie e anexa o usuário ao req.
 */
export const protect = async (req, res, next) => {
    let token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            
            req.user = await User.findByPk(decoded.userId, {
                attributes: { exclude: ['password'] },
            });

            
            if (!req.user) {
                return res.status(401).json({ message: 'Não autorizado, usuário não encontrado.' });
            }

            next();
        } catch (error) { 
            console.error("Erro no middleware de proteção: ", error.message);
            return res.status(401).json({ message: 'Não autorizado, token falhou.'});
        }
    } else {
        return res.status(401).json({ message: 'Não autorizado, sem token.' });
    }
}

