const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password:{
            type: String,
            required: true,
        },

        role:{
            type: String,
            enum: ["CANDIDATE", "COMPANY", "ADMIN"],
            required: true,
        },

        isVerified: {
        type: Boolean,
        default: false,
        },

        authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
        },

        fullName: {
            type: String,
            default: "",
        },

        // Account status — managed by ADMIN only
        // Active    → normal access
        // Suspended → login blocked, user cannot access platform
        // Inactive  → deactivated by user, auto-reactivated on login
        accountStatus: {
            type: String,
            enum: ["Active", "Suspended", "Inactive"],
            default: "Active",
        },

        // Tracks last password change — set on register and on every password update
        passwordChangedAt: {
        type: Date,
        default: null,
        },
    },
    {
        timestamps: true,
    }

);

const User = mongoose.model("User", userSchema);

module.exports = User;