import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

// For Logs and also i can use later for observability but of course in real system we have full info about user data from Jwt extracted from http Only secure cookie
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: any, _res: any, next: () => void) {
    req.id = req.headers['x-request-id'] || uuid();
    next();
  }
}
