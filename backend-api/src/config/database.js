import { Sequelize } from 'sequelize';
import 'dotenv/config';

const { 
    PGDATABASE,
    PGUSER,
    PGPASSWORD,
    PGHOST 
} = process.env;

const sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
    host: PGHOST,
    dialect: 'postgres',
    logging: false,
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Conexão com o banco estabelecida.");

    } catch (err) {
        console.log(
                PGDATABASE,
    PGUSER,
    PGPASSWORD,
    PGHOST 
        );
        
        console.error("Erro ao conectar com o banco: ", err);
        process.exit(1);
    }
};

export { sequelize, connectDB };
