import User from '../models/userModel.js';
import Recipe from '../models/recipeModel.js'
import Avaliation from '../models/avaliationModel.js'
import generateToken from '../utils/generateToken.js';

/**
 * @desc Cria um usuário
 * @route POST /api/users 
 */
export const createUser = async (req, res) => {
    try {
        const { name, type, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });
        }

        const userAlreadyExists = await User.findOne({ 
            where: {email: email}, 
        });

        if (userAlreadyExists) {
            return res.status(400).json({ message: 'Este e-mail já está cadastrado.' });
        }

        const newUser = await User.create({
            name,
            type,
            email,
            password
        });

        if (newUser) {
            generateToken(res, newUser.userId);

            res.status(201).json({
                userId: newUser.userId,
                name: newUser.name,
                type: newUser.type,
                email: newUser.email,
            });
        } else {
            return res.status(400).json({ message: "Dados inválidos. Usuário não foi criado" });
        }
    } catch (err) {
        console.error("Erro ao registrar usuário: ", err);
        res.status(500).json({ message: "Erro no servidor.", error: err.message });
    }
}

/**
 * @desc Busca todos os usuários
 * @route GET /api/users
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: {exclude: ['password']}
        })
        res.status(200).json(users);
    } catch (err) {
        console.error("Erro ao buscar usuários: ", err);
        res.status(500).json({ message: "Erro no servidor." });
    }
}

/**
 * @desc    Buscar o perfil do usuário logado
 * @route   GET /api/users/current
 */
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {
            attributes: {exclude: ['password']},
        })

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error('Erro ao buscar perfil:', err);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
}

/**
 * @desc    Edita o perfil do usuário logado
 * @route   PUT /api/users/current
 */
export const updateCurrentUser = async (req, res) => {
    try {
        const { name, type, email, password } = req.body;
        const userId = req.user.userId;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        user.name = name || user.name;
        user.type = type || user.type;
        user.email = email || user.email;
        if (password) {
            user.password = password;
        }

        const userUpdated = await user.save();

        res.status(200).json({
            userId: userUpdated.userId,
            name: userUpdated.name,
            type: userUpdated.type,
            email: userUpdated.email,
        });

    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        if(error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({message: 'Este email já está em uso.'})
        }
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

/**
 * @desc    Deletar a conta do usuário logado
 * @route   DELETE /api/users/current
 */
export const deleteCurrentUser = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        await Recipe.destroy({
            where: {authorId: userId}
        })

        await Avaliation.destroy({
            where: {userId: userId}
        });

        await User.destroy({
            where: {userId: userId}
        });

        res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });

        res.status(200).json({ message: 'Conta deletada com sucesso.' });

    } catch (error) {
        console.error('Erro ao deletar conta:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

/**
 * @desc    Buscar o perfil de um usuário por ID
 * @route   GET /api/users/:id
 */
export const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId, {
            attributes: ['userId', 'name', 'email', 'createdAt'],
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json(user);

    } catch (error) {
        console.error('Erro ao buscar perfil público:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

/**
 * @desc    Fazer upload da foto de perfil do usuário logado
 * @route   POST /api/users/current/profile-pic
 * @access  Privado
 */
export const uploadProfilePic = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nenhum arquivo enviado.');
    }

    try {
        // req.user.userId é fornecido pelo middleware 'protect'
        const userId = req.user.userId; 
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Salva os dados binários e o mimetype no banco
        user.profilePicMimetype = req.file.mimetype;
        user.profilePicData = req.file.buffer; // O buffer de bytes do multer

        await user.save();

        res.status(200).json({ message: 'Imagem de perfil atualizada com sucesso.' });

    } catch (error) {
        console.error('Erro ao salvar imagem de perfil:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

/**
 * @desc    Buscar a foto de perfil de um usuário por ID
 * @route   GET /api/users/:userId/profile-pic
 * @access  Público
 */
export const getProfilePic = async (req, res) => {
    try {
        const { userId } = req.params; // Pega o ID da URL
        const user = await User.findByPk(userId, {
            // Seleciona apenas os campos que precisamos
            attributes: ['profilePicMimetype', 'profilePicData'] 
        });

        if (!user || !user.profilePicData) {
            return res.status(404).send('Imagem não encontrada.');
        }

        // Define o 'Content-Type' da resposta (ex: 'image/jpeg')
        res.setHeader('Content-Type', user.profilePicMimetype);
        
        // Envia os dados binários (bytea) como resposta
        res.send(user.profilePicData);

    } catch (error) {
        console.error('Erro ao buscar imagem de perfil:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};