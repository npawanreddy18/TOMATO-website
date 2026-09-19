import express from "express";

import SettingsModel from "../models/SettingsModel.js";
import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";

const settingsRouter = express.Router();


// =====================================================
// GET SETTINGS
// PUBLIC
// CUSTOMER FRONTEND CAN USE THIS
// =====================================================

settingsRouter.get("/", async (req, res) => {

    try {

        let settings =
            await SettingsModel.findOne();

        // Create default settings if none exist
        if (!settings) {

            settings =
                await SettingsModel.create({});

        }

        res.status(200).json({

            success: true,

            settings: settings

        });

    } catch (error) {

        console.error(
            "Get settings error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to get settings"

        });

    }

});


// =====================================================
// UPDATE SETTINGS
// ADMIN ONLY
// =====================================================

settingsRouter.put(
    "/update",
    adminAuthMiddleware,

    async (req, res) => {

        try {

            const {
                restaurantName,
                email,
                phone,
                deliveryFee,
                minOrder,
                currency,
                notifications,
                emailNotifications,
                autoConfirm
            } = req.body;


            // =========================================
            // VALIDATION
            // =========================================

            if (
                restaurantName === undefined ||
                email === undefined ||
                phone === undefined ||
                deliveryFee === undefined ||
                minOrder === undefined ||
                currency === undefined
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please provide all settings"

                });

            }


            // =========================================
            // DELIVERY FEE VALIDATION
            // =========================================

            if (
                Number(deliveryFee) < 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Delivery fee cannot be negative"

                });

            }


            // =========================================
            // MINIMUM ORDER VALIDATION
            // =========================================

            if (
                Number(minOrder) < 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Minimum order cannot be negative"

                });

            }


            // =========================================
            // FIND EXISTING SETTINGS
            // =========================================

            let settings =
                await SettingsModel.findOne();


            // =========================================
            // CREATE SETTINGS IF NOT FOUND
            // =========================================

            if (!settings) {

                settings =
                    new SettingsModel();

            }


            // =========================================
            // UPDATE SETTINGS
            // =========================================

            settings.restaurantName =
                restaurantName;

            settings.email =
                email;

            settings.phone =
                phone;

            settings.deliveryFee =
                Number(deliveryFee);

            settings.minOrder =
                Number(minOrder);

            settings.currency =
                currency;


            // =========================================
            // NOTIFICATIONS
            // =========================================

            if (
                notifications !== undefined
            ) {

                settings.notifications =
                    notifications === true ||
                    notifications === "true";

            }


            // =========================================
            // EMAIL NOTIFICATIONS
            // =========================================

            if (
                emailNotifications !== undefined
            ) {

                settings.emailNotifications =
                    emailNotifications === true ||
                    emailNotifications === "true";

            }


            // =========================================
            // AUTO CONFIRM
            // =========================================

            if (
                autoConfirm !== undefined
            ) {

                settings.autoConfirm =
                    autoConfirm === true ||
                    autoConfirm === "true";

            }


            // =========================================
            // SAVE TO MONGODB
            // =========================================

            await settings.save();


            // =========================================
            // RESPONSE
            // =========================================

            res.status(200).json({

                success: true,

                message:
                    "Settings updated successfully",

                settings: settings

            });

        } catch (error) {

            console.error(
                "Update settings error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message:
                    "Failed to update settings"

            });

        }

    }
);


// =====================================================
// EXPORT
// =====================================================

export default settingsRouter;