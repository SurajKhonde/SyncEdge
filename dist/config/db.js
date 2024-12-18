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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const db_config_1 = __importDefault(require("./db.config"));
const table_1 = require("./table");
const createConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield promise_1.default.createConnection({
        host: db_config_1.default.HOST,
        user: db_config_1.default.USER,
        password: db_config_1.default.PASSWORD,
        database: db_config_1.default.DB,
    });
    console.log("Successfully connected to the database.");
    return connection;
});
const createTable = (connection, query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connection.query(query);
        console.log("Table created successfully");
    }
    catch (err) {
        console.error(`Error creating table:`, err);
    }
});
const userInsert = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    const query = "INSERT INTO `users` (`email`, `password`, `user_type`, `role`) VALUES ('admin@gmail.com', '$2a$10$4X0Vbh0SG2SZ9QnWoD67Muf/hFHO0nG31N7lbBnSwe39ZwF9lsYZK', '1', 'Global Admin');";
    const checkAdmin = "SELECT * FROM users WHERE email='admin@gmail.com'";
    try {
        const [rows] = yield connection.query(checkAdmin);
        if (Array.isArray(rows) && rows.length === 0) {
            yield connection.query(query);
            console.log("Data inserted successfully");
        }
        else {
            console.log("Admin user already exists");
        }
    }
    catch (err) {
        console.error("Error checking or inserting admin user:", err);
    }
});
// Function to check and create tables
const checkAndCreateTables = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    for (const e of table_1.table) {
        const checkTableSQL = `SHOW TABLES LIKE '${e.tableName}'`;
        try {
            const [results] = yield connection.query(checkTableSQL);
            if (Array.isArray(results) && results.length === 0) {
                yield createTable(connection, e.query);
            }
            else {
                console.log(`${e.tableName} table already exists`);
            }
        }
        catch (err) {
            console.error(`Error checking ${e.tableName} table:`, err);
        }
    }
});
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield createConnection();
    yield checkAndCreateTables(connection);
    // await userInsert(connection);
});
init().catch((err) => console.error("Error initializing database:", err));
exports.default = createConnection;
