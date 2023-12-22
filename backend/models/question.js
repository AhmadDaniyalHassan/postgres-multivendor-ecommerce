const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Product = require("./product");
const User = require("./user");
const Question = sequelize.define("Question", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please Provide A Title.",
            },
        },
    },
    question: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please Provide A Question.",
            },
        },
    },
    answer: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});
Product.hasMany(Question);
Question.belongsTo(Product);

User.hasMany(Question);
Question.belongsTo(User);

module.exports = Question;