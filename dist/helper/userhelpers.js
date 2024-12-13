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
const db = require("../config/db");
const util = require("util");
const queryAsync = util.promisify(db.query).bind(db);
function findAllAncestors(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let ancestors = [];
        let currentUserId = userId;
        while (currentUserId) {
            const userResult = yield queryAsync(`SELECT refred_by_id FROM users WHERE id = ?`, [currentUserId]);
            if (userResult.length > 0 && userResult[0].refred_by_id) {
                ancestors.push(userResult[0].refred_by_id);
                currentUserId = userResult[0].refred_by_id;
            }
            else {
                break;
            }
        }
        return ancestors;
    });
}
const getUsdCoin = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = "SELECT id FROM cryptocoin WHERE symbol='USD'";
    const usdCoin = yield queryAsync(query);
    return usdCoin;
});
module.exports = {
    findAllAncestors,
    getUsdCoin,
};
