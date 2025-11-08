import { sequelize } from "../config/database.js";
import User from "./userModel.js";
import Recipe from "./recipeModel.js";
import Avaliation from "./avaliationModel.js";

Recipe.belongsTo(User, {foreignKey: 'authorId'});
Recipe.hasMany(Avaliation, {foreignKey: 'recipeId', as: 'avaliations'})

Avaliation.belongsTo(User, {foreignKey: 'userId'});
Avaliation.belongsTo(Recipe, {foreignKey: 'recipeId'});

Avaliation.addHook('afterSave', async (avaliation) => {
    const recipe = await avaliation.getRecipe();
    const [result] = await Avaliation.findAll({
        attributes: [
            [sequelize.fn('AVG', sequelize.col('stars')), 'starsAvg'],
            [sequelize.fn('COUNT', sequelize.col('id')), 'avaliationsAmount']
        ],
        where: { recipeId: recipe.recipeId },
        raw: true
    });
    recipe.starsAvg = parseFloat(result.starsAvg).toFixed(1);
    recipe.avaliationsAmount = parseInt(result.avaliationsAmount, 10);
    await recipe.save()
});

export { sequelize, User, Recipe, Avaliation }