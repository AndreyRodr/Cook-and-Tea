import { sequelize } from "../config/database.js";
import User from "./userModel.js";
import Recipe from "./recipeModel.js";
import Avaliation from "./avaliationModel.js";

Recipe.belongsTo(User, { foreignKey: 'authorId' });
Recipe.hasMany(Avaliation, { foreignKey: 'recipeId', as: 'avaliations' })

Avaliation.belongsTo(User, { foreignKey: 'userId' });
Avaliation.belongsTo(Recipe, { foreignKey: 'recipeId' });

Avaliation.addHook('afterSave', async (avaliation) => {
    try {
        const receitaId = avaliation.RecipeId;

        if (!receitaId) return;

        const [result] = await Avaliation.findAll({
            attributes: [
                [sequelize.fn('AVG', sequelize.col('stars')), 'avgStars'],
                [sequelize.fn('COUNT', sequelize.col('UserId')), 'avaliationsAmount'] 
            ],
            where: { RecipeId: receitaId },
            raw: true,
        });

        if (result) {
            await Recipe.update(
                {
                    starsAvg: parseFloat(result.avgStars).toFixed(1),
                    avaliationsAmount: parseInt(result.avaliationsAmount, 10),
                },
                {
                    where: { receitaId: receitaId }
                }
            );
        }
    } catch (err) {
        console.error("ERRO NO HOOK afterSave da Avaliação:", err);
    }
});

Avaliation.addHook('afterDestroy', async (avaliation) => {
    try {
        const recipeId = avaliation.RecipeId;
        if (!recipeId) return;

        const [result] = await Avaliation.findAll({
            attributes: [
                [sequelize.fn('AVG', sequelize.col('stars')), 'avgStars'],
                [sequelize.fn('COUNT', sequelize.col('UserId')), 'avaliationsAmount']
            ],
            where: { RecipeId: recipeId },
            raw: true,
        });

        const avg = result.avgStars ? parseFloat(result.avgStars).toFixed(1) : 0;
        const total = result.avaliationsAmount ? parseInt(result.avaliationsAmount, 10) : 0;

        await Recipe.update(
            { avgStars: avg, avaliationsAmount: total },
            { where: { recipeId: recipeId } }
        );
    } catch (err) {
        console.error("ERRO NO HOOK afterDestroy da Avaliação:", err);
    }
});
export { sequelize, User, Recipe, Avaliation }