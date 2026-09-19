import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import AdminModel from "../models/AdminModel.js";
import UserModel from "../models/UserModel.js";
import OrderModel from "../models/OrderModel.js";
import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";

const adminRouter = express.Router();


// =====================================================
// ADMIN LOGIN
// =====================================================

adminRouter.post(
    "/login",
    async (req, res) => {

        try {

            const {
                email,
                password
            } = req.body;


            if (!email || !password) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Email and password are required"
                });

            }


            const admin =
                await AdminModel.findOne({
                    email:
                        email.toLowerCase()
                });


            if (!admin) {

                return res.status(401).json({
                    success: false,
                    message:
                        "Invalid admin email or password"
                });

            }


            const passwordMatch =
                await bcrypt.compare(
                    password,
                    admin.password
                );


            if (!passwordMatch) {

                return res.status(401).json({
                    success: false,
                    message:
                        "Invalid admin email or password"
                });

            }


            const token =
                jwt.sign(
                    {
                        id: admin._id,
                        email: admin.email,
                        role: "admin"
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "7d"
                    }
                );


            res.status(200).json({

                success: true,

                message:
                    "Admin login successful",

                token,

                admin: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email
                }

            });

        } catch (error) {

            console.log(
                "Admin login error:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Server error"

            });

        }

    }
);


// =====================================================
// GET ALL CUSTOMERS - ADMIN
// =====================================================

adminRouter.get(
    "/customers",
    adminAuthMiddleware,
    async (req, res) => {

        console.log(
            "CUSTOMERS ROUTE HIT"
        );


        try {

            // ---------------------------------------------
            // GET ALL USERS
            // ---------------------------------------------

            const users =
                await UserModel
                    .find({})
                    .select(
                        "-password"
                    )
                    .sort({
                        createdAt: -1
                    });


            // ---------------------------------------------
            // GET ALL ORDERS
            // ---------------------------------------------

            const orders =
                await OrderModel.find({});


            // ---------------------------------------------
            // ADD ORDER INFORMATION TO EACH CUSTOMER
            // ---------------------------------------------

            const customers =
                users.map((user) => {

                    const userOrders =
                        orders.filter(
                            (order) =>
                                order.userId &&
                                order.userId.toString() ===
                                    user._id.toString()
                        );


                    const totalSpent =
                        userOrders.reduce(
                            (total, order) => {

                                return (
                                    total +
                                    Number(
                                        order.total || 0
                                    )
                                );

                            },
                            0
                        );


                    return {

                        id: user._id,

                        name:
                            user.name,

                        email:
                            user.email,

                        createdAt:
                            user.createdAt,

                        orderCount:
                            userOrders.length,

                        totalSpent:
                            totalSpent

                    };

                });


            // ---------------------------------------------
            // RESPONSE
            // ---------------------------------------------

            console.log(
                "Total customers:",
                customers.length
            );


            res.status(200).json({

                success: true,

                customers

            });

        } catch (error) {

            console.log(
                "Get customers error:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to get customers"

            });

        }

    }
);


// =====================================================
// CUSTOMER STATISTICS - ADMIN
// =====================================================

adminRouter.get(
    "/customer-stats",
    adminAuthMiddleware,
    async (req, res) => {

        try {

            const totalCustomers =
                await UserModel.countDocuments();


            const orders =
                await OrderModel.find({});


            const totalRevenue =
                orders.reduce(
                    (total, order) => {

                        return (
                            total +
                            Number(
                                order.total || 0
                            )
                        );

                    },
                    0
                );


            res.status(200).json({

                success: true,

                totalCustomers,

                totalRevenue,

                totalOrders:
                    orders.length

            });

        } catch (error) {

            console.log(
                "Customer stats error:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to get customer statistics"

            });

        }

    }
);


export default adminRouter;