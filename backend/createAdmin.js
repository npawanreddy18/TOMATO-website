import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dns from "dns";

import AdminModel from "./models/AdminModel.js";

dotenv.config();

// =====================================================
// MONGODB DNS FIX
// =====================================================

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

// =====================================================
// CREATE ADMIN
// =====================================================

const createAdmin = async () => {
    try {

        // Check environment variables
        if (!process.env.MONGODB_URI) {
            console.log(
                "MONGODB_URI is missing from .env"
            );
            return;
        }

        if (!process.env.ADMIN_EMAIL) {
            console.log(
                "ADMIN_EMAIL is missing from .env"
            );
            return;
        }

        if (!process.env.ADMIN_PASSWORD) {
            console.log(
                "ADMIN_PASSWORD is missing from .env"
            );
            return;
        }

        // =====================================================
        // CONNECT TO MONGODB
        // =====================================================

        console.log(
            "Connecting to MongoDB..."
        );

        await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log(
            "MongoDB connected successfully"
        );

        // =====================================================
        // ADMIN DETAILS
        // =====================================================

        const name =
            process.env.ADMIN_NAME ||
            "Tomato Owner";

        const email =
            process.env.ADMIN_EMAIL
                .trim()
                .toLowerCase();

        const password =
            process.env.ADMIN_PASSWORD;

        // =====================================================
        // CHECK EXISTING ADMIN
        // =====================================================

        const existingAdmin =
            await AdminModel.findOne({
                email: email
            });

        if (existingAdmin) {

            console.log(
                "Admin already exists."
            );

            // Update name
            existingAdmin.name = name;

            // Update password
            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );

            existingAdmin.password =
                hashedPassword;

            await existingAdmin.save();

            console.log(
                "Admin details updated successfully."
            );

            console.log(
                "Admin email:",
                email
            );

            await mongoose.connection.close();

            console.log(
                "MongoDB connection closed."
            );

            return;
        }

        // =====================================================
        // HASH PASSWORD
        // =====================================================

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        // =====================================================
        // CREATE ADMIN
        // =====================================================

        const admin =
            new AdminModel({
                name: name,
                email: email,
                password: hashedPassword
            });

        await admin.save();

        // =====================================================
        // SUCCESS MESSAGE
        // =====================================================

        console.log(
            "========================================"
        );

        console.log(
            "Admin created successfully!"
        );

        console.log(
            "Admin name:",
            name
        );

        console.log(
            "Admin email:",
            email
        );

        console.log(
            "Password has been securely hashed."
        );

        console.log(
            "========================================"
        );

        // =====================================================
        // CLOSE DATABASE
        // =====================================================

        await mongoose.connection.close();

        console.log(
            "MongoDB connection closed."
        );

    } catch (error) {

        console.log(
            "Create admin error:"
        );

        console.log(
            error.message
        );

        try {
            await mongoose.connection.close();
        } catch {
            // Ignore database close error
        }
    }
};

createAdmin();