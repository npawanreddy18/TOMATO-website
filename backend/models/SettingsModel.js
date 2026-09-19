import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
    {
        restaurantName: {
            type: String,
            default: "Tomato",
            trim: true
        },

        email: {
            type: String,
            default: "",
            trim: true
        },

        phone: {
            type: String,
            default: "",
            trim: true
        },

        deliveryFee: {
            type: Number,
            default: 2,
            min: 0
        },

        minOrder: {
            type: Number,
            default: 0,
            min: 0
        },

        currency: {
            type: String,
            default: "$",
            trim: true
        },

        notifications: {
            type: Boolean,
            default: true
        },

        emailNotifications: {
            type: Boolean,
            default: true
        },

        autoConfirm: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const SettingsModel = mongoose.model(
    "Settings",
    settingsSchema
);

export default SettingsModel;