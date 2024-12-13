"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { findAllAncestors } = require("./userhelpers");
const db = require("../config/db");
const util = require("util");
const queryAsync = util.promisify(db.query).bind(db);
const getPairFees = (firstCoinId, secondCoinId, reqUser) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = reqUser;
    const ancestors = yield findAllAncestors(userId);
    const userIds = [userId, ...ancestors]; // Array of user and their ancestors' IDs
    // Create a dynamically generated placeholder string for SQL query based on the number of user IDs
    const placeholders = userIds.map(() => "?").join(", ");
    const sql = `
        SELECT 
      cryptocoinFirst.id as firstCoinId, 
      cryptocoinSecond.id as secondCoinId, 
      coinpair.current_price as currentPairPrice, 
      coinpair.id as pairId, 
      SUM( comm.buy_commission) as buy_commission, 
      SUM( comm.sell_commission) as sell_commission, 
      comm.type 
    FROM 
      coinpair 
      LEFT JOIN cryptocoin as cryptocoinFirst ON coinpair.coin_first_id = cryptocoinFirst.id 
      LEFT JOIN cryptocoin as cryptocoinSecond ON coinpair.coin_second_id = cryptocoinSecond.id 
      LEFT JOIN commission as comm ON comm.currency = coinpair.id AND comm.user_id IN (${placeholders})
    WHERE 
      cryptocoinFirst.id =? AND 
      cryptocoinSecond.id =?
    GROUP BY 
      coinpair.id;`;
    const findData = yield queryAsync(sql, [
        ...userIds,
        firstCoinId,
        secondCoinId,
    ]);
    var comValue = 0;
    var sellValue = 0;
    var comType;
    if (findData.length === 0) {
        comValue = 0;
        sellValue = 0;
        comType = "";
    }
    else {
        comValue = findData[0].buy_commission;
        sellValue = findData[0].sell_commission;
        comType = findData[0].type;
    }
    const feesStruct = {
        buyFees: comValue,
        sellFees: sellValue,
        type: comType,
    };
    return feesStruct;
});
const coinInfo = (coinName) => __awaiter(void 0, void 0, void 0, function* () {
    const getIdCoin = "SELECT * FROM cryptocoin WHERE id=?";
    try {
        const coinIdData = yield queryAsync(getIdCoin, [coinName]);
        return coinIdData[0];
    }
    catch (error) {
        return error;
    }
});
const getPairInfo = (firstCoin, secondCoin) => __awaiter(void 0, void 0, void 0, function* () {
    const getIdCoin = "SELECT coinpair.id as pairId,coinpair.is_vendor, coinpair.coin_first_id,coinpair.coin_second_id,c1.symbol as Short_Name1,c2.symbol as Short_Name2 FROM coinpair LEFT JOIN cryptocoin c1 ON c1.id = coinpair.coin_first_id LEFT JOIN cryptocoin c2 ON c2.id = coinpair.coin_second_id where coinpair.coin_first_id =?  and coinpair.coin_second_id =?";
    try {
        const coinIdData = yield queryAsync(getIdCoin, [firstCoin, secondCoin]);
        return coinIdData[0];
    }
    catch (error) {
        return error;
    }
});
const fetchUserBalanceById = (userId, coinId) => __awaiter(void 0, void 0, void 0, function* () {
    const userBalanceSql = "SELECT sum(coin_amount) as coinBalance FROM `transactions` WHERE user_id = ? AND cryptocoin_id =? ";
    try {
        const userBalancData = yield queryAsync(userBalanceSql, [userId, coinId]);
        const userBalance = userBalancData.length > 0 ? userBalancData[0].coinBalance : 0;
        return userBalance;
    }
    catch (error) {
        return error;
    }
});
const getTotalMargin = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT SUM((quantity * price ) / leverage) AS totalMargin FROM crypto_margin_orders WHERE user_id=? AND (status='open' OR status='pending')`;
    const [margin] = yield queryAsync(query, [userId]);
    return margin ? margin.totalMargin : 0;
});
const getOpenOrders = (userId, pairId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = "SELECT * FROM crypto_margin_orders WHERE user_id=? AND currency_pair=? AND status='open'";
    const orders = yield queryAsync(query, [userId, pairId]);
    return orders;
});
module.exports = {
    getPairFees,
    coinInfo,
    getPairInfo,
    fetchUserBalanceById,
    getTotalMargin,
    getOpenOrders
};
