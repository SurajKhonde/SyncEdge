"use strict";
// const CryptoJS = require("crypto-js");
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// function encryptData(data, secretKey) {
//   const encryptedData = CryptoJS.AES.encrypt(
//     JSON.stringify(data),
//     secretKey
//   ).toString();
//   return encryptedData;
// }
// module.exports = encryptData;
const crypto_js_1 = __importDefault(require("crypto-js"));
function encryptData(data, secretKey) {
    const encryptedData = crypto_js_1.default.AES.encrypt(JSON.stringify(data), secretKey).toString();
    return encryptedData;
}
exports.default = encryptData;
