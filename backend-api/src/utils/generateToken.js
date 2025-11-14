import jwt from 'jsonwebtoken';
import 'dotenv/config'

/**
 * @description Gera um token JWT e o anexa a um cookie
 * @param {object} res - O objeto de resposta do express 
 * @param {string} userId - O Id do usuário para acessar o token 
 */
const generateToken = (res, userId) => {
  try {
    const token = jwt.sign(
      { userId: userId },     
      process.env.JWT_SECRET, 
      { expiresIn: '30d' }
    );
    res.cookie('jwt', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict', 
      maxAge: 30 * 24 * 60 * 60 * 1000
    });
  } catch (err) {
    console.error('Erro ao gerar token: ', err);
  }
};

export default generateToken;