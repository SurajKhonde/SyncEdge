"use strict";
const i18n = require("i18n");
const path = require("path");
i18n.configure({
    locales: ["en", "cn", "hn"], // English, Chinese, and Hindi
    directory: path.join(__dirname, "lang"), // The directory where translations are stored
    defaultLocale: "en", // Default language
    header: "accept-language", // Use the 'Accept-Language' header to detect language
    autoReload: true, // Automatically reload translation files when changed
    syncFiles: true, // Keep the translation files in sync
    objectNotation: true, // Use object notation in translation files
});
module.exports = i18n;
