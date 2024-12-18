import i18n from 'i18n';
import path from 'path';

i18n.configure({
  locales: ["en", "cn", "hn"], // English, Chinese, and Hindi
  directory: path.join(__dirname, "lang"), // The directory where translations are stored
  defaultLocale: "en", // Default language
  header: "accept-language", // Use the 'Accept-Language' header to detect language
  autoReload: true, // Automatically reload translation files when changed
  syncFiles: true, // Keep the translation files in sync
  objectNotation: true, // Use object notation in translation files
});

// Export the i18n instance to use in other parts of your application
export default i18n;
