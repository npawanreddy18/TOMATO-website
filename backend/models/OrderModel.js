import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        // USER INFORMATION
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // CUSTOMER INFORMATION
        firstName: {
            type: String,
            required: true,
            trim: true
        },

        lastName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        // DELIVERY ADDRESS
        address: {
            type: String,
            required: true,
            trim: true
        },

        city: {
            type: String,
            required: true,
            trim: true
        },

        state: {
            type: String,
            required: true,
            trim: true
        },

        zipCode: {
            type: String,
            required: true,
            trim: true
        },

        // ORDER ITEMS
        items: [
            {
                itemId: {
                    type: String,
                    required: true
                },

                name: {
                    type: String,
                    required: true
                },

                price: {
                    type: Number,
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],

        // PRICE INFORMATION
        subtotal: {
            type: Number,
            required: true
        },

        deliveryFee: {
            type: Number,
            required: true
        },

        total: {
            type: Number,
            required: true
        },

        // PAYMENT
        paymentMethod: {
            type: String,
            enum: ["cash", "card", "upi"],
            required: true
        },

        // ORDER STATUS
        status: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "Preparing",
                "Out for Delivery",
                "Delivered",
                "Cancelled"
            ],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;