require("dotenv").config();
exports.userRole = {
  GAdmin: "0",
  SAdmin: "1",
  Staff: "2",
  Admin: "3",
  Broker: "4",
  IB: "5",
  SubIB: "6",
};
exports.userType = {
  New: "1",
  Old: "2",
};

exports.kycStatus = {
  Pending: "Pending",
  Rejected: "Rejected",
  Verified: "Verified",
};

exports.binanceSymbolPriceApi =
  "https://api.binance.com/api/v3/ticker/price?symbol=";
exports.binanceExChangeInfoApi = "https://api.binance.com/api/v3/exchangeInfo";
exports.krakenSymbolPriceApi = "https://api.kraken.com/0/public/Trades?pair=";

exports.jwtSecretKey = process.env.jwtSecretKey;
