"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = __importDefault(require("i18n"));
const path_1 = __importDefault(require("path"));
i18n_1.default.configure({
    locales: ["en", "cn", "hn"], // English, Chinese, and Hindi
    directory: path_1.default.join(__dirname, "lang"), // The directory where translations are stored
    defaultLocale: "en", // Default language
    header: "accept-language", // Use the 'Accept-Language' header to detect language
    autoReload: true, // Automatically reload translation files when changed
    syncFiles: true, // Keep the translation files in sync
    objectNotation: true, // Use object notation in translation files
});
// Export the i18n instance to use in other parts of your application
exports.default = i18n_1.default;
