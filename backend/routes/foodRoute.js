import express from "express";
import multer from "multer";
import FoodModel from "../models/foodModel.js";
import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";
import cloudinary from "../config/cloudinary.js";

const foodRouter = express.Router();


// =====================================================
// MULTER IMAGE STORAGE
// =====================================================

// Store image temporarily in memory.
// The image will then be uploaded to Cloudinary.
const storage = multer.memoryStorage();


// =====================================================
// MULTER UPLOAD
// =====================================================

const upload = multer({
    storage: storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        if (file.mimetype.startsWith("image/")) {

            cb(null, true);

        } else {

            cb(
                new Error(
                    "Only image files are allowed"
                )
            );

        }
    }
});


// =====================================================
// CLOUDINARY IMAGE UPLOAD
// =====================================================

const uploadToCloudinary = (buffer) => {

    return new Promise((resolve, reject) => {

        const stream =
            cloudinary.uploader.upload_stream(
                {
                    folder: "tomato-food",
                    resource_type: "image"
                },

                (error, result) => {

                    if (error) {

                        reject(error);

                    } else {

                        resolve(result);

                    }

                }
            );

        stream.end(buffer);

    });

};


// =====================================================
// GET ALL FOOD
// =====================================================

foodRouter.get(
    "/list",
    async (req, res) => {

        try {

            const foods =
                await FoodModel.find({})
                    .sort({
                        createdAt: -1
                    });

            res.status(200).json({

                success: true,

                foods: foods

            });

        } catch (error) {

            console.log(
                "Get food error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message:
                    "Unable to fetch food items"

            });

        }

    }
);


// =====================================================
// ADD FOOD
// =====================================================

foodRouter.post(
    "/add",

    adminAuthMiddleware,

    upload.single("image"),

    async (req, res) => {

        try {

            const {
                name,
                description,
                price,
                category,
                available
            } = req.body;


            // CHECK DETAILS

            if (
                !name ||
                !description ||
                price === undefined ||
                !category
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "All food details are required"

                });

            }


            // CHECK IMAGE

            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Food image is required"

                });

            }


            // UPLOAD IMAGE TO CLOUDINARY

            const cloudinaryResult =
                await uploadToCloudinary(
                    req.file.buffer
                );


            // CLOUDINARY IMAGE URL

            const imageUrl =
                cloudinaryResult.secure_url;


            // CREATE FOOD

            const food =
                new FoodModel({

                    name: name,

                    description: description,

                    price: Number(price),

                    category: category,

                    image: imageUrl,

                    available:
                        available === undefined
                            ? true
                            : available === "true"

                });


            // SAVE

            await food.save();


            // RESPONSE

            res.status(201).json({

                success: true,

                message:
                    "Food item added successfully!",

                food: food

            });

        } catch (error) {

            console.log(
                "Add food error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message:
                    "Unable to add food item"

            });

        }

    }
);


// =====================================================
// UPDATE FOOD
// =====================================================

foodRouter.put(
    "/update/:id",

    adminAuthMiddleware,

    upload.single("image"),

    async (req, res) => {

        try {

            const food =
                await FoodModel.findById(
                    req.params.id
                );


            if (!food) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Food item not found"

                });

            }


            const {
                name,
                description,
                price,
                category,
                available
            } = req.body;


            // UPDATE NAME

            if (name !== undefined) {

                food.name = name;

            }


            // UPDATE DESCRIPTION

            if (description !== undefined) {

                food.description =
                    description;

            }


            // UPDATE PRICE

            if (price !== undefined) {

                food.price =
                    Number(price);

            }


            // UPDATE CATEGORY

            if (category !== undefined) {

                food.category =
                    category;

            }


            // UPDATE IMAGE

            if (req.file) {

                const cloudinaryResult =
                    await uploadToCloudinary(
                        req.file.buffer
                    );

                food.image =
                    cloudinaryResult.secure_url;

            }


            // UPDATE AVAILABILITY

            if (available !== undefined) {

                food.available =
                    available === "true";

            }


            // SAVE

            await food.save();


            // RESPONSE

            res.status(200).json({

                success: true,

                message:
                    "Food item updated successfully",

                food: food

            });

        } catch (error) {

            console.log(
                "Update food error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message:
                    "Unable to update food item"

            });

        }

    }
);


// =====================================================
// DELETE FOOD
// =====================================================

foodRouter.delete(
    "/delete/:id",

    adminAuthMiddleware,

    async (req, res) => {

        try {

            const food =
                await FoodModel.findById(
                    req.params.id
                );


            if (!food) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Food item not found"

                });

            }


            await FoodModel.findByIdAndDelete(
                req.params.id
            );


            res.status(200).json({

                success: true,

                message:
                    "Food item deleted successfully"

            });

        } catch (error) {

            console.log(
                "Delete food error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message:
                    "Unable to delete food item"

            });

        }

    }
);


// =====================================================
// CHANGE AVAILABILITY
// =====================================================

foodRouter.put(
    "/availability/:id",

    adminAuthMiddleware,

    async (req, res) => {

        try {

            const {
                available
            } = req.body;


            if (
                typeof available !==
                "boolean"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Available must be true or false"

                });

            }


            const food =
                await FoodModel.findByIdAndUpdate(

                    req.params.id,

                    {
                        available:
                            available
                    },

                    {
                        new: true
                    }

                );


            if (!food) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Food item not found"

                });

            }


            res.status(200).json({

                success: true,

                message:
                    "Food availability updated",

                food: food

            });

        } catch (error) {

            console.log(
                "Availability error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message:
                    "Unable to update availability"

            });

        }

    }
);


// =====================================================
// EXPORT
// =====================================================

export default foodRouter;