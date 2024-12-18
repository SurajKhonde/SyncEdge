
import { Response } from 'express';
function sendError(res: Response, message: string): Response {
  return res.send({
    status: false,
    message: message,
  });
}

export default sendError;
