import { User } from "../models/index.js";
import generateToken from '../utils/generateToken.js';

/**
 * @desc    Autenticar (Login) um usuário e enviar cookie
 * @route   POST /api/auth/login
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Por favor, forneça email e senha.' });
        }

        const user = await User.findOne({ 
            where: { email: email.toLowerCase() } 
        });

        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const verifyHash = await user.matchPassword(password)
        console.log(verifyHash);
        

        if (user && verifyHash) {
            
            generateToken(res, user.userId); 

            res.status(200).json({
                userId: user.userId,
                name: user.name,
                email: user.email,
                type: user.type
            });

        } else {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

/**
 * @desc    Deslogar um usuário e limpar o cookie
 * @route   POST /api/auth/logout
 */
export const logout = (req, res) => {
    res.cookie('jwt', '', { // Seta o cookie 'jwt' como vazio
        httpOnly: true,
        expires: new Date(0), // Define a data de expiração para o passado
    });
    res.status(200).json({ message: 'Logout realizado com sucesso.' });
};