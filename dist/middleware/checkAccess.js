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
function unAuthorizedError(res) {
    return res
        .status(403)
        .send({ message: "You are not allowed to access this route" });
}
function checkPermissions({ permissionType, module, name, check }) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const { loginUserId, role } = req;
        try {
            if (role === "Global Admin" || !check) {
                next();
                return;
            }
            const selectQuery = `
              SELECT
                module_name AS moduleName,
                permission_type AS name,
                \`read\`,
                \`write\`,
                \`delete\`
              FROM permissions
              WHERE userId = ${loginUserId};`;
            const userPermissions = yield dbQueryAsync(selectQuery);
            const moduleRequest = userPermissions.filter((permission) => permission.moduleName === module && permission.name === name);
            if (!(moduleRequest === null || moduleRequest === void 0 ? void 0 : moduleRequest.length)) {
                return unAuthorizedError(res);
            }
            if (moduleRequest[0][permissionType] === "0") {
                console.log("no permissions");
                return unAuthorizedError(res);
            }
            next();
        }
        catch (error) {
            unAuthorizedError(res);
        }
    });
}
module.exports = { checkPermissions };
