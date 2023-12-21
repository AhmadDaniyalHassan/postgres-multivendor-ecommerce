const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Product = require("./product");

const Category = sequelize.define("Category", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "Please provide a category name.",
            },
        },
    },
});

Category.hasMany(Product);
Product.belongsTo(Category);

module.exports = Category;
