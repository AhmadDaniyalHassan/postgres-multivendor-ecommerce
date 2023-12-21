const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Category = require("./category");
const Product = require('./product')

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
    image: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please provide Category image.",
            }
        }
    },
});

Category.hasMany(SubCategory, { onDelete: 'CASCADE' });
SubCategory.belongsTo(Category, { onDelete: 'CASCADE' });


SubCategory.hasMany(Product);
Product.belongsTo(SubCategory);

module.exports = SubCategory;
