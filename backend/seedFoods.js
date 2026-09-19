import dns from "dns";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import FoodModel from "./models/foodModel.js";

// =====================================================
// DNS CONFIGURATION
// =====================================================

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

// =====================================================
// ENVIRONMENT
// =====================================================

dotenv.config();


// =====================================================
// PATHS
// =====================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendAssetsPath = path.join(
    __dirname,
    "../frontend/src/assets"
);

const uploadsPath = path.join(
    __dirname,
    "uploads"
);


// =====================================================
// CREATE UPLOADS FOLDER
// =====================================================

if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, {
        recursive: true
    });
}


// =====================================================
// YOUR 32 FOOD ITEMS
// =====================================================

const foods = [
    {
        name: "Greek salad",
        image: "food_1.png",
        price: 12,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Salad"
    },
    {
        name: "Veg salad",
        image: "food_2.png",
        price: 18,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Salad"
    },
    {
        name: "Clover Salad",
        image: "food_3.png",
        price: 16,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Salad"
    },
    {
        name: "Chicken Salad",
        image: "food_4.png",
        price: 24,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Salad"
    },

    {
        name: "Lasagna Rolls",
        image: "food_5.png",
        price: 14,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Rolls"
    },
    {
        name: "Peri Peri Rolls",
        image: "food_6.png",
        price: 12,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Rolls"
    },
    {
        name: "Chicken Rolls",
        image: "food_7.png",
        price: 20,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Rolls"
    },
    {
        name: "Veg Rolls",
        image: "food_8.png",
        price: 15,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Rolls"
    },

    {
        name: "Ripple Ice Cream",
        image: "food_9.png",
        price: 14,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Deserts"
    },
    {
        name: "Fruit Ice Cream",
        image: "food_10.png",
        price: 22,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Deserts"
    },
    {
        name: "Jar Ice Cream",
        image: "food_11.png",
        price: 10,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Deserts"
    },
    {
        name: "Vanilla Ice Cream",
        image: "food_12.png",
        price: 12,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Deserts"
    },

    {
        name: "Chicken Sandwich",
        image: "food_13.png",
        price: 12,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Sandwich"
    },
    {
        name: "Vegan Sandwich",
        image: "food_14.png",
        price: 18,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Sandwich"
    },
    {
        name: "Grilled Sandwich",
        image: "food_15.png",
        price: 16,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Sandwich"
    },
    {
        name: "Bread Sandwich",
        image: "food_16.png",
        price: 24,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Sandwich"
    },

    {
        name: "Cup Cake",
        image: "food_17.png",
        price: 14,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Cake"
    },
    {
        name: "Vegan Cake",
        image: "food_18.png",
        price: 12,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Cake"
    },
    {
        name: "Butterscotch Cake",
        image: "food_19.png",
        price: 20,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Cake"
    },
    {
        name: "Sliced Cake",
        image: "food_20.png",
        price: 15,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Cake"
    },

    {
        name: "Garlic Mushroom",
        image: "food_21.png",
        price: 14,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Pure Veg"
    },
    {
        name: "Fried Cauliflower",
        image: "food_22.png",
        price: 22,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Pure Veg"
    },
    {
        name: "Mix Veg Pulao",
        image: "food_23.png",
        price: 10,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Pure Veg"
    },
    {
        name: "Rice Zucchini",
        image: "food_24.png",
        price: 12,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Pure Veg"
    },

    {
        name: "Cheese Pasta",
        image: "food_25.png",
        price: 12,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Pasta"
    },
    {
        name: "Tomato Pasta",
        image: "food_26.png",
        price: 18,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Pasta"
    },
    {
        name: "Creamy Pasta",
        image: "food_27.png",
        price: 16,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Pasta"
    },
    {
        name: "Chicken Pasta",
        image: "food_28.png",
        price: 24,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Pasta"
    },

    {
        name: "Buttter Noodles",
        image: "food_29.png",
        price: 14,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Noodles"
    },
    {
        name: "Veg Noodles",
        image: "food_30.png",
        price: 12,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Noodles"
    },
    {
        name: "Somen Noodles",
        image: "food_31.png",
        price: 20,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Noodles"
    },
    {
        name: "Cooked Noodles",
        image: "food_32.png",
        price: 15,
        description: "Food provides essential nutrients for overall health and well-being",
        category: "Noodles"
    }
];


// =====================================================
// SEED DATABASE
// =====================================================

const seedFoods = async () => {

    try {

        console.log("Connecting to MongoDB...");

        await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log("MongoDB connected.");

        // -------------------------------------------------
        // DELETE OLD FOOD DATA
        // -------------------------------------------------

        await FoodModel.deleteMany({});

        console.log("Old food items removed.");

        // -------------------------------------------------
        // COPY FOOD IMAGES
        // -------------------------------------------------

        const foodData = [];

        for (const food of foods) {

            const sourceImage = path.join(
                frontendAssetsPath,
                food.image
            );

            const destinationImage = path.join(
                uploadsPath,
                food.image
            );

            if (!fs.existsSync(sourceImage)) {

                console.log(
                    `❌ Image not found: ${sourceImage}`
                );

                continue;
            }

            fs.copyFileSync(
                sourceImage,
                destinationImage
            );

            console.log(
                `✅ Copied image: ${food.image}`
            );

            foodData.push({

                name: food.name,

                description: food.description,

                price: food.price,

                category: food.category,

                image:
                    `http://localhost:4000/images/${food.image}`,

                available: true

            });
        }


        // -------------------------------------------------
        // CHECK FOOD DATA
        // -------------------------------------------------

        if (foodData.length === 0) {

            console.log(
                "❌ No food items were inserted."
            );

            await mongoose.connection.close();

            process.exit(1);
        }


        // -------------------------------------------------
        // INSERT INTO MONGODB
        // -------------------------------------------------

        await FoodModel.insertMany(
            foodData
        );


        console.log("");

        console.log(
            "========================================"
        );

        console.log(
            "🎉 FOOD SEEDING COMPLETED"
        );

        console.log(
            "========================================"
        );

        console.log(
            `Total foods inserted: ${foodData.length}`
        );

        console.log(
            "========================================"
        );


        await mongoose.connection.close();

        process.exit(0);

    } catch (error) {

        console.error("");

        console.error(
            "❌ SEEDING FAILED"
        );

        console.error(
            error.message
        );

        try {
            await mongoose.connection.close();
        } catch (closeError) {
            // Ignore close error
        }

        process.exit(1);
    }
};


seedFoods();