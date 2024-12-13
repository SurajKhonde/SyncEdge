import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.port;


app.get('/', (req: Request, res: Response): void => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, (): void => {
  console.log(`App running at http://localhost:${port}`);
});
