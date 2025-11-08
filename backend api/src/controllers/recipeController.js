import Recipe from '../models/recipeModel.js'

/**
 * 
 * @desc Criar uma nova receita
 * @route POST /api/recipe
 * @access Privado (requer login e ser do tipo chefe) 
 */
export const createRecipe = async (req, res) => {
    try {
        const { name, description, ingredients, instructions, tags, images } = req.body;

        const autorId = req.user.userId;

        if(req.user.type !== "chefe") {
            return res.status(403).json({message: "Usuário não autorizado"});
        }

        if (!titulo || !ingredients || !instructions) {
            return res.status(400).json({message: 'Campos obrigatórios estão faltando'});
        }

        const newRecipe = await Recipe(
            name,
            autorId,
            description,
            ingredients,
            instructions,
            tags,
            images
        );

        res.status(201).json(newRecipe);
    } catch (err) {
        console.error("Erro ao criar receita: ", err);
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: "Dados inválidos", details: err.message });
        }
        res.status(500).json({ message: "Erro no servidor ao tentar criar uma receita" }); 
    }
}