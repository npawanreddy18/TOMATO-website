import express from "express";

import OrderModel from "../models/OrderModel.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";

const orderRouter = express.Router();

console.log("🔥 THIS ORDER ROUTE FILE IS LOADED");


// =====================================================
// TEST ORDER ROUTE
// =====================================================

orderRouter.get("/test-status", (req, res) => {

    console.log("TEST STATUS ROUTE HIT");

    res.status(200).json({
        success: true,
        message: "Order status route is working"
    });

});


// =====================================================
// PLACE ORDER
// =====================================================

orderRouter.post(
    "/place",
    authMiddleware,
    async (req, res) => {

        try {

            const {
                firstName,
                lastName,
                email,
                phone,
                address,
                city,
                state,
                zipCode,
                items,
                subtotal,
                deliveryFee,
                total,
                paymentMethod
            } = req.body;


            // ---------------------------------------------
            // VALIDATE ORDER DETAILS
            // ---------------------------------------------

            if (
                !firstName ||
                !lastName ||
                !email ||
                !phone ||
                !address ||
                !city ||
                !state ||
                !zipCode ||
                !items ||
                items.length === 0 ||
                subtotal === undefined ||
                deliveryFee === undefined ||
                total === undefined ||
                !paymentMethod
            ) {

                return res.status(400).json({
                    success: false,
                    message: "All order details are required"
                });

            }


            // ---------------------------------------------
            // CREATE ORDER
            // ---------------------------------------------

            const order = new OrderModel({

                userId: req.user.id,

                firstName,
                lastName,
                email,
                phone,

                address,
                city,
                state,
                zipCode,

                items,

                subtotal,
                deliveryFee,
                total,

                paymentMethod,

                status: "Pending"

            });


            // ---------------------------------------------
            // SAVE ORDER
            // ---------------------------------------------

            const savedOrder =
                await order.save();


            console.log(
                "Order placed successfully:",
                savedOrder._id
            );


            // ---------------------------------------------
            // RESPONSE
            // ---------------------------------------------

            res.status(201).json({

                success: true,

                message:
                    "Order placed successfully",

                order: savedOrder

            });

        } catch (error) {

            console.log(
                "Place order error:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to place order"

            });

        }

    }
);


// =====================================================
// GET MY ORDERS
// =====================================================

orderRouter.get(
    "/my-orders",
    authMiddleware,
    async (req, res) => {

        try {

            const orders =
                await OrderModel
                    .find({
                        userId: req.user.id
                    })
                    .sort({
                        createdAt: -1
                    });


            res.status(200).json({

                success: true,

                orders

            });

        } catch (error) {

            console.log(
                "Get my orders error:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to get orders"

            });

        }

    }
);


// =====================================================
// GET ALL ORDERS - ADMIN
// =====================================================

orderRouter.get(
    "/all-orders",
    adminAuthMiddleware,
    async (req, res) => {

        console.log(
            "ALL ORDERS ROUTE HIT"
        );


        try {

            const orders =
                await OrderModel
                    .find({})
                    .sort({
                        createdAt: -1
                    });


            console.log(
                "Total orders:",
                orders.length
            );


            res.status(200).json({

                success: true,

                orders

            });

        } catch (error) {

            console.log(
                "Get all orders error:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to get all orders"

            });

        }

    }
);


// =====================================================
// UPDATE ORDER STATUS - ADMIN
// =====================================================

orderRouter.patch(
    "/status/:orderId",
    adminAuthMiddleware,
    async (req, res) => {

        console.log("");
        console.log(
            "======================================"
        );
        console.log(
            "UPDATE STATUS ROUTE HIT"
        );
        console.log(
            "======================================"
        );


        try {

            const {
                orderId
            } = req.params;


            const {
                status
            } = req.body;


            console.log(
                "Order ID:",
                orderId
            );


            console.log(
                "New Status:",
                status
            );


            // ---------------------------------------------
            // ALLOWED STATUSES
            // ---------------------------------------------

            const allowedStatuses = [

                "Pending",

                "Confirmed",

                "Preparing",

                "Out for Delivery",

                "Delivered",

                "Cancelled"

            ];


            // ---------------------------------------------
            // CHECK STATUS
            // ---------------------------------------------

            if (!status) {

                console.log(
                    "Status was not provided"
                );


                return res.status(400).json({

                    success: false,

                    message:
                        "Status is required"

                });

            }


            if (
                !allowedStatuses.includes(
                    status
                )
            ) {

                console.log(
                    "Invalid status:",
                    status
                );


                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid order status"

                });

            }


            // ---------------------------------------------
            // CHECK ORDER ID
            // ---------------------------------------------

            if (!orderId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Order ID is required"

                });

            }


            // ---------------------------------------------
            // UPDATE ORDER
            // ---------------------------------------------

            const updatedOrder =
                await OrderModel.findByIdAndUpdate(

                    orderId,

                    {
                        status: status
                    },

                    {
                        new: true,
                        runValidators: true
                    }

                );


            // ---------------------------------------------
            // ORDER NOT FOUND
            // ---------------------------------------------

            if (!updatedOrder) {

                console.log(
                    "Order not found:",
                    orderId
                );


                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found"

                });

            }


            // ---------------------------------------------
            // SUCCESS
            // ---------------------------------------------

            console.log(
                "Order status updated successfully"
            );


            console.log(
                "Order:",
                updatedOrder._id
            );


            console.log(
                "Status:",
                updatedOrder.status
            );


            res.status(200).json({

                success: true,

                message:
                    "Order status updated successfully",

                order: updatedOrder

            });

        } catch (error) {

            console.log("");
            console.log(
                "UPDATE STATUS ERROR:"
            );


            console.log(
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to update order status"

            });

        }

    }
);


// =====================================================
// EXPORT
// =====================================================

export default orderRouter;