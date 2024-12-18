import express, { Request, Response } from 'express';
import bodyParser from "body-parser";
import i18n from "i18n";
import userRoute from './routes/userRoute';
import * as dotenv from 'dotenv';
import cleanOldLogs from './utils/errorLogmaintainer'
dotenv.config();
const app = express();
app.use(i18n.init);
app.use(bodyParser.json());
const port = process.env.port || 3000;
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true"); // Change to string
  next();
});
app.use("/api/v1", userRoute);
setInterval(() => {
  cleanOldLogs();
}, 24 * 60 * 60 * 1000); 
app.listen(port, (): void => {
  console.log(`App running at http://localhost:${port}`);
});
