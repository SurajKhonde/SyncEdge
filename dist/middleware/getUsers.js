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
const dbQueryAsync = util.promisify(db.query).bind(db);
function getIbSubIbs(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { loginUserId, role } = req;
        let sql = "";
        if (role === "Admin") {
            sql = `SELECT CONCAT_WS(',', GROUP_CONCAT(DISTINCT ib.id ORDER BY ib.id ASC SEPARATOR ','), GROUP_CONCAT(DISTINCT subIb.id ORDER BY subIb.id ASC SEPARATOR ',') ) AS userIds FROM users AS admin LEFT JOIN users AS broker ON admin.id = broker.refred_by_id AND broker.role = 'Broker' LEFT JOIN users AS ib ON broker.id = ib.refred_by_id AND ib.role = 'Informatic Broker (IB)' LEFT JOIN users AS subIb ON ib.id = subIb.refred_by_id AND subIb.role = 'SubIB' WHERE admin.role = 'Admin' AND admin.id = ${loginUserId};`;
        }
        else if (role === "Broker") {
            sql = `SELECT CONCAT_WS(',', GROUP_CONCAT(DISTINCT ib.id ORDER BY ib.id ASC SEPARATOR ','), GROUP_CONCAT(DISTINCT subIb.id ORDER BY subIb.id ASC SEPARATOR ',') ) AS userIds FROM users AS broker LEFT JOIN users AS ib ON broker.id = ib.refred_by_id AND ib.role = 'Informatic Broker (IB)' LEFT JOIN users AS subIb ON ib.id = subIb.refred_by_id AND subIb.role = 'SubIB' WHERE broker.role = 'Broker' AND broker.id = ${loginUserId};`;
        }
        if (sql) {
            const [ibSubIbsIds] = yield dbQueryAsync(sql);
            console.log(ibSubIbsIds, "ibSubIbsIds middleware");
            req.users = ibSubIbsIds.userIds || null;
        }
        next();
    });
}
module.exports = { getIbSubIbs };
