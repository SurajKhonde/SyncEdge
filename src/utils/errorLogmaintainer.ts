import fs from 'fs';
import path from 'path';

const logDirectory = path.join(__dirname, 'errorLogs');
const LOG_RETENTION_DAYS = 3;

const cleanOldLogs = () => {
  const now = Date.now();
  const expirationTime = LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000;

  fs.readdirSync(logDirectory).forEach(file => {
    const filePath = path.join(logDirectory, file);
    const fileStat = fs.statSync(filePath);
    const fileAge = now - fileStat.mtimeMs;

    if (fileAge > expirationTime) {
      fs.unlinkSync(filePath);
      console.log(`Deleted old log file: ${file}`);
    }
  });
};

 export default cleanOldLogs;
