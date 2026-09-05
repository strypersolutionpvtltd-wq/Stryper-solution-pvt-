const mongoose = require("mongoose");

const systemSettingsSchema = new mongoose.Schema(
  {
    publicRegistration: {
      type: Boolean,
      default: true,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    // Dynamic site contact coordinates
    phone: {
      type: String,
      default: "+91 9565310410",
    },
    email: {
      type: String,
      default: "recruiter@strypersolution.com",
    },
    address: {
      type: String,
      default: "Pan India Projects",
    },
    whatsapp: {
      type: String,
      default: "918448590303",
    },
    est: {
      type: String,
      default: "2010",
    },
    website: {
      type: String,
      default: "www.stryperinteriorandinfra.com",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SystemSettings", systemSettingsSchema);
