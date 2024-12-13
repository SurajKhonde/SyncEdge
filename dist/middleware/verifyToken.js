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
var jwt = require("jsonwebtoken");
var { jwtSecretKey } = require("../config/enum");
const db = require("../config/db");
const util = require("util");
const dbQueryAsync = util.promisify(db.query).bind(db);
function getUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const getUserInfo = "SELECT * FROM users WHERE id=?";
        const user = yield dbQueryAsync(getUserInfo, [userId]);
        return user[0];
    });
}
function verifytoken(req, res, next) {
    var token = req.headers["authorization"] || req.headers["x-access-token"];
    // console.log(req, req.headers["public"], "hekkiiii");
    if (req.headers["public"]) {
        req.loginUserId = req.body.userId;
        return next();
    }
    if (token) {
        token = token.replace(/^Bearer\s+/, "");
        if (!token)
            return res
                .status(403)
                .send({ status: false, message: "No token provided", data: "" });
        jwt.verify(token, jwtSecretKey, function (err, decoded) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err)
                    return res.status(200).send({
                        status: false,
                        message: "Failed to authenticate token.",
                        data: "",
                    });
                // if everything good, save to request for use in other routes
                req.loginUserId = decoded.id;
                const user = yield getUser(decoded.id);
                req.role = user.role;
                next();
            });
        });
    }
    else {
    }
}
module.exports = verifytoken;
