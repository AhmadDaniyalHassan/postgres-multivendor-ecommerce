const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        logging: false, // Set this option to false to disable logging

    }
);

// Test the connection
sequelize
    .authenticate()
    .then(() => {
        console.log(`Connected to database ${process.env.DB_NAME} on host ${process.env.DB_HOST} successfully.`.yellow);
    })
    .catch((err) => {
        console.error("Unable to connect to the database:".red, err);
    });

module.exports = sequelize;