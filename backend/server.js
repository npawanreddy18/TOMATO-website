import dns from "dns";

// =====================================================
// DNS CONFIGURATION
// =====================================================

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);


// =====================================================
// IMPORTS
// =====================================================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import userRouter from "./routes/userRoute.js";
import orderRouter from "./routes/orderRoute.js";
import adminRouter from "./routes/adminRoute.js";
import foodRouter from "./routes/foodRoute.js";
import settingsRouter from "./routes/settingsRoute.js";


// =====================================================
// ENVIRONMENT
// =====================================================

dotenv.config();


// =====================================================
// APP
// =====================================================

const app = express();

const port = 4000;


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());


// =====================================================
// FOOD IMAGE FOLDER
// =====================================================

app.use(
    "/images",
    express.static("uploads")
);


// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {

    res.send(
        "Tomato Food Delivery API is working"
    );

});


// =====================================================
// USER ROUTES
// =====================================================

app.use(
    "/api/user",
    userRouter
);


// =====================================================
// ORDER ROUTES
// =====================================================

app.use(
    "/api/order",
    orderRouter
);


// =====================================================
// ADMIN ROUTES
// =====================================================

app.use(
    "/api/admin",
    adminRouter
);


// =====================================================
// FOOD ROUTES
// =====================================================

app.use(
    "/api/food",
    foodRouter
);


 app.use(
    "/api/settings", 
    settingsRouter
);


// =====================================================
// START SERVER
// =====================================================

const startServer = async () => {

    try {

        await connectDB();

        app.listen(
            port,
            () => {

                console.log(
                    "========================================"
                );

                console.log(
                    "Tomato backend server started"
                );

                console.log(
                    `Server: http://localhost:${port}`
                );

                console.log(
                    "Food API: http://localhost:4000/api/food/list"
                );

                console.log(
                    "========================================"
                );

            }
        );

    } catch (error) {

        console.log(
            "Server failed to start:"
        );

        console.log(
            error.message
        );

    }

};


startServer();