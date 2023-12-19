const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Category = require("./category");
const SubCategory = sequelize.define("SubCategory", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please provide a sub-category name.",
            },
        },
    },
});

Category.hasMany(SubCategory, { onDelete: 'CASCADE' });
SubCategory.belongsTo(Category, { onDelete: 'CASCADE' });

module.exports = SubCategory;
