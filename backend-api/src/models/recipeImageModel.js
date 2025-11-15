import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const RecipeImage = sequelize.define(
    'recipe_images', 
    {
        imageId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'imageId'
        },
        imageUrl: {
            type: DataTypes.STRING, // Ou DataTypes.TEXT se a URL for muito longa
            allowNull: false,
        }
    },
    {
        timestamps: true,
        schema: 'cook n tea',
    }
);

export default RecipeImage;