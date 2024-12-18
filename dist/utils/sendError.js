"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sendError(res, message) {
    return res.send({
        status: false,
        message: message,
    });
}
exports.default = sendError;
