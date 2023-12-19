const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ShopUser = sequelize.define("shopUser", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    shopName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please Provide An Shop Name.",
            },
        },
    },
    shopOwner: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please Provide An Shop Owner Name.",
            },
        },
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please Provide An Email.",
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please provide a password.",
            },
        },
    },
    productWearHouse: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please Provide Product Wear House.",
            },
        },
    },
    shopHandlerAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please Provide An Shop Handler Address.",
            },
        },
    },
    shopPhoneNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please provide a phone number.",
            },
            is: {
                args: /^\+\d+$/, // Example regex for a phone number with a leading '+'
                msg: "Please provide a valid phone number.",
            },
        },
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2,
    },
});

module.exports = ShopUser;
