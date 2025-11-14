import { Recipe, RecipeImage } from '../models/index.js';

/**
 * @desc    Buscar uma imagem de receita pelo ID
 * @route   GET /api/recipe-images/:imageId
 * @access  Público
 */
export const getRecipeImageById = async (req, res) => {
    try {
        const { imageId } = req.params;
        const image = await RecipeImage.findByPk(imageId, {
            attributes: ['mimetype', 'imageData']
        });

        if (!image) {
            return res.status(404).send('Imagem não encontrada.');
        }

        res.setHeader('Content-Type', image.mimetype);
        res.send(image.imageData);

    } catch (error) {
        console.error('Erro ao buscar imagem de receita:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

/**
 * @desc    Deletar uma imagem de receita
 * @route   DELETE /api/recipe-images/:imageId
 * @access  Privado (Autor da Receita)
 */
export const deleteRecipeImage = async (req, res) => {
    try {
        const { imageId } = req.params;
        const userId = req.user.userId;

        const image = await RecipeImage.findByPk(imageId, {
            include: { model: Recipe, attributes: ['authorId'] }
        });

        if (!image) {
            return res.status(404).json({ message: "Imagem não encontrada." });
        }

        // Verifica se o usuário logado é o autor da receita
        if (image.recipe.authorId !== userId) {
            return res.status(403).json({ message: "Acesso negado. Você não é o autor." });
        }

        await image.destroy();
        res.status(200).json({ message: "Imagem deletada com sucesso." });

    } catch (error) {
        console.error('Erro ao deletar imagem:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
}