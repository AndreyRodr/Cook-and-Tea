import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Recipe = sequelize.define(
    'recipes',
    {
        recipeId: {
            type: DataTypes.INTEGER, 
            primaryKey: true,
            autoIncrement: true,     
            allowNull: false,
            field: 'recipeId'            
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
        ingredients: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            allowNull: false,
        },
        instructions: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            allowNull: false,
        },
        tags: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
        },
        images: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
        },
        prepTime: {
            type: DataTypes.STRING,
        },
        portions: {
            type: DataTypes.INTEGER,
        },
        starsAvg: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        avaliationsAmount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    },
    {
        timestamps: true,
        schema: 'cook n tea',
    }
);

export default Recipe