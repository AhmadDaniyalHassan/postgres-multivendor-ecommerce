const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const ShopUser = require("./shop");

const Product = sequelize.define("Product", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please Provide A Product Name.",
            },
        },
    },
    quantity: {
        type: DataTypes.DECIMAL(10, 0), // 10 total digits, 0 decimal places
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please Provide Product Quantity.",
            },
        },
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please provide product image.",
            }
        }
    },
    productDescription: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please provide a Product Description.",
            },
        },
    },
    inStock: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
            notNull: {
                msg: "Please provide whether the product is in stock or not.",
            },
        },
    },
    price: {
        type: DataTypes.DECIMAL(10, 0), // 10 total digits, 0 decimal places
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please Provide Product Price.",
            },
        },
    },
});

ShopUser.hasMany(Product, { onDelete: 'CASCADE' });
Product.belongsTo(ShopUser, { onDelete: 'CASCADE' });



module.exports = Product;
