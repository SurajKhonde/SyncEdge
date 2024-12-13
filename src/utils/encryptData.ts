// const CryptoJS = require("crypto-js");

// function encryptData(data, secretKey) {
//   const encryptedData = CryptoJS.AES.encrypt(
//     JSON.stringify(data),
//     secretKey
//   ).toString();
//   return encryptedData;
// }

// module.exports = encryptData;
import CryptoJS from 'crypto-js';

function encryptData(data: object, secretKey: string): string {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey
  ).toString();
  return encryptedData;
}

export default encryptData;
