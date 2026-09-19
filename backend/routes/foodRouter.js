import express from "express";

import FoodModel from "../models/foodModel.js";
import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";

const foodRouter = express.Router();


// GET ALL FOOD ITEMS
foodRouter.get("/list", async (req, res) => {
    try {
        const foods = await FoodModel.find({}).sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            foods
        });
    } catch (error) {
        console.log("Get food error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to fetch food items"
        });
    }
});


// ADD FOOD ITEM
foodRouter.post(
    "/add",
    adminAuthMiddleware,
    async (req, res) => {
        try {
            const {
                name,
                description,
                price,
                category,
                image,
                available
            } = req.body;

            if (
                !name ||
                !description ||
                price === undefined ||
                !category ||
                !image
            ) {
                return res.status(400).json({
                    success: false,
                    message: "All food details are required"
                });
            }

            const food = new FoodModel({
                name,
                description,
                price,
                category,
                image,
                available:
                    available === undefined
                        ? true
                        : available
            });

            await food.save();

            res.status(201).json({
                success: true,
                message: "Food item added successfully",
                food
            });
        } catch (error) {
            console.log("Add food error:", error.message);

            res.status(500).json({
                success: false,
                message: "Unable to add food item"
            });
        }
    }
);


// UPDATE FOOD ITEM
foodRouter.put(
    "/update/:id",
    adminAuthMiddleware,
    async (req, res) => {
        try {
            const food = await FoodModel.findById(
                req.params.id
            );

            if (!food) {
                return res.status(404).json({
                    success: false,
                    message: "Food item not found"
                });
            }

            const {
                name,
                description,
                price,
                category,
                image,
                available
            } = req.body;

            if (name !== undefined) food.name = name;
            if (description !== undefined) {
                food.description = description;
            }
            if (price !== undefined) food.price = price;
            if (category !== undefined) {
                food.category = category;
            }
            if (image !== undefined) food.image = image;
            if (available !== undefined) {
                food.available = available;
            }

            await food.save();

            res.status(200).json({
                success: true,
                message: "Food item updated successfully",
                food
            });
        } catch (error) {
            console.log("Update food error:", error.message);

            res.status(500).json({
                success: false,
                message: "Unable to update food item"
            });
        }
    }
);


// DELETE FOOD ITEM
foodRouter.delete(
    "/delete/:id",
    adminAuthMiddleware,
    async (req, res) => {
        try {
            const food = await FoodModel.findById(
                req.params.id
            );

            if (!food) {
                return res.status(404).json({
                    success: false,
                    message: "Food item not found"
                });
            }

            await FoodModel.findByIdAndDelete(
                req.params.id
            );

            res.status(200).json({
                success: true,
                message: "Food item deleted successfully"
            });
        } catch (error) {
            console.log("Delete food error:", error.message);

            res.status(500).json({
                success: false,
                message: "Unable to delete food item"
            });
        }
    }
);


// CHANGE AVAILABILITY
foodRouter.put(
    "/availability/:id",
    adminAuthMiddleware,
    async (req, res) => {
        try {
            const { available } = req.body;

            if (typeof available !== "boolean") {
                return res.status(400).json({
                    success: false,
                    message: "Available must be true or false"
                });
            }

            const food = await FoodModel.findByIdAndUpdate(
                req.params.id,
                { available },
                { new: true }
            );

            if (!food) {
                return res.status(404).json({
                    success: false,
                    message: "Food item not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Food availability updated",
                food
            });
        } catch (error) {
            console.log(
                "Availability update error:",
                error.message
            );

            res.status(500).json({
                success: false,
                message: "Unable to update availability"
            });
        }
    }
);

export default foodRouter;