import { Sequelize } from 'sequelize';
import 'dotenv/config';

const { PG_DB, PG_USER, PG_PASSWORD, PG_HOST } = process.env;

const sequelize = new Sequelize(PG_DB, PG_USER, PG_PASSWORD, {
    host: PG_HOST,
    dialect: 'postgres',
    logging: false,
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Conexão com o banco estabelecida.");

    } catch (err) {
        console.error("Erro ao conectar com o banco: ", err.message);
        process.exit(1);
    }
};

export { sequelize, connectDB };
