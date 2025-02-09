import logger from '../utils/logger';
import { JsonWebTokenError } from 'jsonwebtoken';
import {verifyToken} from '../utils/tokenizer';
import { NEXT_APP_ID } from '../../config';

// create an instance from jsonwebtokenError to include code
export class JsonWebTokenError2 extends JsonWebTokenError {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function decodeTokenMiddleware(req: any): Promise<void> {
  try {
    const token = req.headers.authorization.split(' ')[1] || req.headers.authorization;
    if (token) {
      try {
        req.decodedUser = await verifyToken(token);
        req.APP_ID = req.headers['x-app-id'];
        req.IS_NEXT_APP = req.headers.APP_ID === NEXT_APP_ID;
        
        return;
      } catch (err: any) {
        throw new JsonWebTokenError2('Invalid token', 401);
      }
    } else {
      throw new JsonWebTokenError2('Please log in first', 401);
    }
  } catch (err: any) {
    // if the error is an instance of JsonWebTokenError, throw it
    if (err instanceof JsonWebTokenError2) {
      throw err;
    }
    throw new JsonWebTokenError2('Please log in first', 401);
  }
}

export default decodeTokenMiddleware;