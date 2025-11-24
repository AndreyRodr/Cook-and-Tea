import User from '../models/userModel.js';
import Recipe from '../models/recipeModel.js'
import Avaliation from '../models/avaliationModel.js'
import RecipeImage from '../models/recipeImageModel.js';
import generateToken from '../utils/generateToken.js';
import { uploadFileToS3, deleteFileFromS3 } from '../utils/s3Service.js';
import { profile } from 'console';

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
            where: { email: email },
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
            attributes: { exclude: ['password'] }
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
            attributes: { exclude: ['password'] },
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

        if (req.file) {
            // Se um arquivo foi enviado, faz o upload para o S3
            if (user.profilePicUrl) {
                // Se já existe uma imagem, deleta a antiga
                await deleteFileFromS3(user.profilePicUrl);
            }
            const imageUrl = await uploadFileToS3(req.file);
            user.profilePicUrl = imageUrl;
        }

        const userUpdated = await user.save();

        res.status(200).json({
            userId: userUpdated.userId,
            name: userUpdated.name,
            type: userUpdated.type,
            email: userUpdated.email,
            profilePicUrl: userUpdated.profilePicUrl
        });

    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Este email já está em uso.' })
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

        if (user.profilePicUrl) {
            await deleteFileFromS3(user.profilePicUrl);
        }

        await Recipe.destroy({
            where: { authorId: userId }
        })

        await Avaliation.destroy({
            where: { userId: userId }
        });

        await User.destroy({
            where: { userId: userId }
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
            attributes: [
                "userId",
                "name",
                "type",
                "email",
                "password",
                "createdAt",
                "updatedAt",
                "profilePicUrl"
            ],
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

        // Salva a URL da imagem antiga ANTES de fazer o upload da nova
        const oldImageUrl = user.profilePicUrl;

        // Faz o upload da NOVA imagem para o S3
        const newImageUrl = await uploadFileToS3(req.file);

        // Atualiza o banco de dados com a NOVA URL
        user.profilePicUrl = newImageUrl;
        await user.save();

        // Se existia uma imagem antiga, deleta ela do S3
        if (oldImageUrl) {
            await deleteFileFromS3(oldImageUrl);
        }

        res.status(200).json({ message: 'Imagem de perfil atualizada com sucesso.', imageUrl: imageUrl });

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
            attributes: ['profilePicUrl']
        });

        if (!user || !user.profilePicUrl) {
            return res.status(404).send('Imagem não encontrada.');
        }

        res.redirect(user.profilePicUrl);
    } catch (error) {
        console.error('Erro ao buscar imagem de perfil:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

/**
 * @desc    Listar receitas favoritas do usuário logado
 * @route   GET /api/users/current/favorites
 */
export const listFavorites = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findByPk(userId, {
            // Usa o 'alias' que definimos no index.js para incluir as receitas
            include: 
                {
                    model: Recipe,
                    as: 'FavoriteRecipes',
                    include: [ 
                        {
                            model: RecipeImage,
                            as: 'recipeImages', // Alias definido no index.js
                            attributes: ['imageUrl'] // Traz apenas a URL
                        }
                    ],
                    through: { attributes: [] } 
                }
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.status(200).json(user.FavoriteRecipes);
    } catch (error) {
        console.error('Erro ao listar favoritos:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

/**
 * @desc    Adicionar uma receita aos favoritos
 * @route   POST /api/users/current/favorites
 */
export const addFavorite = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { recipeId } = req.body; // O frontend enviará o ID da receita

        if (!recipeId) {
            return res.status(400).json({ message: 'ID da receita é obrigatório.' });
        }

        const user = await User.findByPk(userId);
        const recipe = await Recipe.findByPk(recipeId);

        if (!user || !recipe) {
            return res.status(404).json({ message: 'Usuário ou receita não encontrado.' });
        }

        // Método "mágico" do Sequelize: add[Alias]
        await user.addFavoriteRecipe(recipe);

        res.status(201).json({ message: 'Receita adicionada aos favoritos.' });
    } catch (error) {
        console.error('Erro ao adicionar favorito:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

/**
 * @desc    Remover uma receita dos favoritos
 * @route   DELETE /api/users/current/favorites/:recipeId
 */
export const removeFavorite = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { recipeId } = req.params; // O ID vem da URL

        const user = await User.findByPk(userId);
        const recipe = await Recipe.findByPk(recipeId);

        if (!user || !recipe) {
            return res.status(404).json({ message: 'Usuário ou receita não encontrado.' });
        }

        // Método "mágico" do Sequelize: remove[Alias]
        await user.removeFavoriteRecipe(recipe);

        res.status(200).json({ message: 'Receita removida dos favoritos.' });
    } catch (error) {
        console.error('Erro ao remover favorito:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

/**
 * @desc    Excluir a foto de perfil
 * @route   DELETE /api/users/current/profile-pic
 */
export const deleteProfilePic = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // 1. Pega a URL antiga antes de apagar
        const oldFileUrl = user.profilePicUrl;

        // 2. Apaga a URL do banco de dados (Neon)
        user.profilePicUrl = null;
        // 3. Apaga o arquivo do S3 (AWS)
        await deleteFileFromS3(oldFileUrl);
        await user.save();


        res.status(200).json({ message: 'Foto de perfil removida com sucesso.' });

    } catch (error) {
        console.error('Erro ao remover foto de perfil:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};