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
        mimetype: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imageData: {
            type: DataTypes.BLOB, 
            allowNull: false,
        }
    },
    {
        timestamps: true,
        schema: 'cook n tea',
    }
);

export default RecipeImage;