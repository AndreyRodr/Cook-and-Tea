import { Avaliation, User, Recipe } from '../models/index.js';

/**
 * @desc    Criar uma nova avaliação
 * @route   POST /api/avaliations
 * @access  Privado
 */
export const createAvaliation = async (req, res) => {
    try {
        const { stars, recipeId } = req.body;
        
        console.log(req.body);
        
        const userId = req.user.userId;

        if (!stars || !recipeId) {
            return res.status(400).json({ message: "Faltando 'stars' ou 'recipeId'." });
        }

        const newAvaliation = await Avaliation.create({
            stars,
            userId: userId,
            recipeId: recipeId
        });

        res.status(201).json(newAvaliation);

    } catch (err) {
        console.error("Erro ao criar avaliação: ", err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "Você já avaliou esta receita." });
        }
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: "Dados inválidos", details: err.message });
        }
        res.status(500).json({ message: "Erro no servidor" });
    }
};

/**
 * @desc    Resgatar todas as avaliações de uma receita
 * @route   GET /api/avaliations/recipe/:id
 */
export const getAvaliationsByRecipes = async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log(id);
        

        const avaliation = await Avaliation.findAll({
            where: { recipeId: id }, 
            order: [['createdAt', 'DESC']], 
            include: { 
                model: User,
                attributes: ['userId', 'name'] 
            }
        });

        res.status(200).json(avaliation);

    } catch (err) {
        console.error("Erro ao buscar avaliações: ", err);
        res.status(500).json({ message: "Erro no servidor" });
    }
};

/**
 * @desc    Editar uma avaliação
 * @route   PUT /api/avaliations/:id
 * @access  Privado (só o dono)
 */
export const updateAvaliation = async (req, res) => {
    try {
        const { id } = req.params; 
        const { stars } = req.body; 
        const userId = req.user.userId; 

        console.log(userId);
        

        const avaliation = await Avaliation.findByPk(id);
        
        if (!avaliation) {
            return res.status(404).json({ message: "Avaliação não encontrada." });
        }

        if (avaliation.userId !== userId) {
            return res.status(403).json({ message: "Acesso negado. Você não é o dono desta avaliação." });
        }

        avaliation.stars = stars;
        await avaliation.save();

        res.status(200).json(avaliation);

    } catch (err) {
        console.error("Erro ao editar avaliação: ", err);
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: "Dados inválidos (nota 0.5-5)", details: err.message });
        }
        res.status(500).json({ message: "Erro no servidor" });
    }
};

/**
 * @desc    Deletar uma avaliação
 * @route   DELETE /api/avaliations/:id
 * @access  Privado (só o dono)
 */
export const deleteAvaliation = async (req, res) => {
    try {
        const { id } = req.params; 
        const userId = req.user.userId; 

        const avaliation = await Avaliation.findByPk(id);

        if (!avaliation) {
            return res.status(404).json({ message: "Avaliação não encontrada." });
        }

        if (avaliation.userId !== userId) {
            return res.status(403).json({ message: "Acesso negado." });
        }

        await avaliation.destroy();

        res.status(200).json({ message: "Avaliação deletada com sucesso." });

    } catch (err) {
        console.error("Erro ao deletar avaliação: ", err);
        res.status(500).json({ message: "Erro no servidor" });
    }
};