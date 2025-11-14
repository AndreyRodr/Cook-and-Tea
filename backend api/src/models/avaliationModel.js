import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Avaliation = sequelize.define(
    'avaliations',
    {
        stars: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0.5,
                max: 5,
            },
        },
    },
    {
        timestamps: true,
        schema: 'cook n tea',
        indexes: [
            {
                unique: true,
                fields: ['userId', 'recipeId'],
            },
        ],
    }
);

export default Avaliation;