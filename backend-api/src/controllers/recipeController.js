import { Recipe, User, Avaliation, sequelize } from '../models/index.js' 
import RecipeImage from '../models/recipeImageModel.js';
import { uploadFileToS3, deleteFileFromS3 } from '../utils/s3Service.js';
import { Op } from 'sequelize';

/**
 * 
 * @desc Criar uma nova receita
 * @route POST /api/recipes
 * @access Privado (requer login e ser do tipo chefe) 
 */
export const createRecipe = async (req, res) => {
    try {
        const formatToArray = (data) => {
            if (!data) return []; 
            if (Array.isArray(data)) return data; 
            
            if (typeof data === 'string') {
                return data.split(/\r?\n/)
                            .map(item => item.trim())
                            .filter(item => item !== '');
            }
            return [data]; // Fallback
        };

        const { name, description, prepTime, portions } = req.body;

        const authorId = req.user.userId;
        
        const ingredients = formatToArray(req.body.ingredients);
        const instructions = formatToArray(req.body.instructions);
        const tags = formatToArray(req.body.tags);

        if(req.user.type !== "chefe") {
            return res.status(403).json({message: "Usuário não autorizado"});
        }

        if (!name || !ingredients || !instructions || !prepTime || !portions) {
            return res.status(400).json({message: 'Campos obrigatórios estão faltando'});
        }

        const newRecipe = await Recipe.create(
            {
                name,
                authorId,
                description,
                ingredients,
                instructions,
                tags,
                prepTime,
                portions
            }
        );
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file => uploadFileToS3(file));
            const imageUrls = await Promise.all(uploadPromises);

            const imagesData = imageUrls.map(url => ({
                recipeId: newRecipe.recipeId,
                imageUrl: url
            }));

            await RecipeImage.bulkCreate(imagesData);
        }
        
        res.status(201).json(newRecipe);
    } catch (err) {
        console.error("Erro ao criar receita: ", err);
        if (err.name === "SequelizeValidationError") {
            return res.status(400).json({ message: "Dados inválidos", details: err.message });
        }
        res.status(500).json({ message: "Erro no servidor ao tentar criar uma receita" }); 
    }
}

/**
 * @desc    Resgatar todas as receitas
 * @route   GET /api/recipes
 */
export const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                { model: User, as: 'user', attributes: ['userId'] },
                { model: Avaliation, as: 'avaliations', include: { model: User, attributes: ['userId', 'name'] } },
                { model: RecipeImage, as: 'recipeImages', attributes: ['imageUrl'] } ]
        });
        res.status(200).json(recipes);
    } catch (err) {
        console.error("Erro ao buscar receitas: ", err);
        res.status(500).json({ message: "Erro no servidor" });
    }
};

/**
 * @desc    Resgatar receita por ID
 * @route   GET /api/recipes/:id
 */
export const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id, {
            include: [
                { model: User, as: 'user', attributes: ['userId'] },
                { model: Avaliation, as: 'avaliations', include: { model: User, attributes: ['userId', 'name'] } },
                { model: RecipeImage, as: 'recipeImages', attributes: ['imageUrl'] } 
            ]
        });

        if (!recipe) {
            return res.status(404).json({ message: "Receita não encontrada." });
        }
        res.status(200).json(recipe);
    } catch (err) {
        console.error("Erro ao buscar receita por ID: ", err);
        res.status(500).json({ message: "Erro no servidor" });
    }
};

/**
 * @desc    Resgatar receitas por autor
 * @route   GET /api/recipes/author/:userId
 */
export const getRecipeByAuthor = async (req, res) => {
    try {
        const recipes = await Recipe.findAll({
            where: { authorId: req.params.userId },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(recipes);
    } catch (err) {
        console.error("Erro ao buscar receitas por autor: ", err);
        res.status(500).json({ message: "Erro no servidor" });
    }
};

/**
 * @desc    Buscar receita por nome (Search)
 * @route   GET /api/recipes/search?q=...
 */
export const getRecipeByName = async (req, res) => {
    try {
        const { q, favorites } = req.query;

        let whereCondition = {};

        if (q) {
            whereCondition.name = {
                [Op.iLike]: `%${q}%`
            };
        }

        if (favorites === 'true') {;
            whereCondition.tags = {
                [Op.contains]: ['favoritos']
            };
        }

        const recipes = await Recipe.findAll({
            where: whereCondition,
            include: [
                { model: User, as: 'user', attributes: ['userId'] },
                { model: Avaliation, as: 'avaliations', include: { model: User, attributes: ['userId', 'name'] } },
                { model: RecipeImage, as: 'recipeImages', attributes: ['imageUrl'] } 
            ]
        });

        res.status(200).json(recipes);
    } catch (err) {
        console.error("Erro ao buscar receitas: ", err);
        res.status(500).json({ message: "Erro no servidor" });
    }
};

/**
 * @desc    Resgatar receitas por tag
 * @route   GET /api/recipes/tag/:tagname
 */
export const getRecipeByTag = async (req, res) => {
    try {
        const { tagname } = req.params;
        const recipes = await Recipe.findAll({
            where: {
                tags: {
                    [Op.contains]: [tagname] 
                }
            },
            include: [
                { model: User, as: 'user', attributes: ['userId'] },
                { model: Avaliation, as: 'avaliations', include: { model: User, attributes: ['userId', 'name'] } },
                { model: RecipeImage, as: 'recipeImages', attributes: ['imageUrl'] } 
            ]
        });
        res.status(200).json(recipes);
    } catch (err) {
        console.error("Erro ao buscar por tag: ", err);
        res.status(500).json({ message: "Erro no servidor" });
    }
};

/**
 * @desc    Editar uma receita
 * @route   PUT /api/recipes/:id
 */
export const updateRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await Recipe.findByPk(id);

        console.log(id);
        

        if (!recipe) {
            return res.status(404).json({ message: "Receita não encontrada." });
        }

        if (recipe.authorId !== req.user.userId) {
            return res.status(403).json({ message: "Acesso negado. Você não é o autor desta receita." });
        }

        const [updated] = await Recipe.update(req.body, {
            where: { recipeId: id }
        });

        if (updated) {
            const updatedRecipe = await Recipe.findByPk(id);
            return res.status(200).json(updatedRecipe);
        }
        
        throw new Error('Falha ao atualizar a receita.');

    } catch (err) {
        console.error("Erro ao editar receita: ", err);
        res.status(500).json({ message: "Erro no servidor" });
    }
};

/**
 * @desc    Deletar uma receita
 * @route   DELETE /api/recipes/:id
 * @access  Privado (só o autor)
 */
export const deleteRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await Recipe.findByPk(id);

        console.log(recipe.authorId);
        

        if (!recipe) {
            return res.status(404).json({ message: "Receita não encontrada." });
        }

        if (recipe.authorId !== req.user.userId) {
            return res.status(403).json({ message: "Acesso negado. Você não é o autor." });
        }
        const imagesToDelete = await RecipeImage.findAll({
            where: { recipeId: id }
        });

        // Cria uma lista de promessas para deletar cada imagem do S3
        if (imagesToDelete && imagesToDelete.length > 0) {
            const deletePromises = imagesToDelete.map(image => 
                deleteFileFromS3(image.imageUrl) 
            );
            
            // Aguarda todas as exclusões do S3 terminarem
            await Promise.all(deletePromises);
        }

        await RecipeImage.destroy({ 
            where: { recipeId: id }
        });

        await Avaliation.destroy({
            where: { recipeId: id }
        });

        await recipe.destroy();

        res.status(200).json({ message: "Receita deletada com sucesso." });

    } catch (err) {
        console.error("Erro ao deletar receita: ", err);
        res.status(500).json({ message: "Erro no servidor" });
    }
};

