import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModel from "../models/UserModel.js";
import OrderModel from "../models/OrderModel.js";
import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";

const userRouter = express.Router();


// =====================================================
// REGISTER
// =====================================================

userRouter.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        if (
            !name ||
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All fields are required"

            });

        }


        const existingUser =
            await UserModel.findOne({
                email
            });


        if (existingUser) {

            return res.status(400).json({

                success: false,

                message:
                    "User already exists"

            });

        }


        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        const newUser =
            new UserModel({

                name: name,

                email: email,

                password:
                    hashedPassword

            });


        await newUser.save();


        res.status(201).json({

            success: true,

            message:
                "User registered successfully"

        });

    } catch (error) {

        console.log(
            "Register Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error"

        });

    }

});


// =====================================================
// LOGIN
// =====================================================

userRouter.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required"

            });

        }


        const user =
            await UserModel.findOne({
                email
            });


        if (!user) {

            return res.status(400).json({

                success: false,

                message:
                    "User not found"

            });

        }


        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordCorrect) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid password"

            });

        }


        // =============================================
        // CREATE JWT TOKEN
        // =============================================

        const token =
            jwt.sign(

                {
                    id: user._id,

                    email: user.email

                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "7d"
                }

            );


        // =============================================
        // SEND TOKEN + USER
        // =============================================

        res.status(200).json({

            success: true,

            message:
                "Login successful",

            token: token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email

            }

        });

    } catch (error) {

        console.log(
            "Login Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error"

        });

    }

});


// =====================================================
// GET ALL CUSTOMERS
// ADMIN ONLY
// =====================================================

userRouter.get(
    "/all",
    adminAuthMiddleware,

    async (req, res) => {

        try {

            // =========================================
            // GET ALL USERS
            // =========================================

            const users =
                await UserModel.find({})
                    .select(
                        "-password"
                    )
                    .sort({
                        createdAt: -1
                    });


            // =========================================
            // GET ORDER COUNT FOR EACH USER
            // =========================================

            const customers =
                await Promise.all(

                    users.map(
                        async (user) => {

                            const orderCount =
                                await OrderModel.countDocuments({
                                    userId: user._id
                                });


                            return {

                                _id:
                                    user._id,

                                name:
                                    user.name,

                                email:
                                    user.email,

                                orders:
                                    orderCount,

                                createdAt:
                                    user.createdAt

                            };

                        }
                    )

                );


            // =========================================
            // RESPONSE
            // =========================================

            res.status(200).json({

                success: true,

                customers:
                    customers,

                totalCustomers:
                    customers.length

            });

        } catch (error) {

            console.log(
                "Get customers error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to fetch customers"

            });

        }

    }
);


// =====================================================
// EXPORT
// =====================================================

export default userRouter;