import bcrypt from "bcryptjs";
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const User = sequelize.define(
    'users',
    {
        userId: {
            type: DataTypes.INTEGER, 
            primaryKey: true,        
            autoIncrement: true,     
            allowNull: false,
            field: 'userId'           
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('comum', 'chefe'),
            defaultValue: 'comum',
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        profilePicMimetype: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        profilePicData: {
            type: DataTypes.BLOB, 
            allowNull: true,
        }
    },
    {
        timestamps: true,
        schema: 'cook n tea',
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt)
                }
            },
        }
    }
);

User.prototype.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default User;