import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

// Logging Ingo about user request how long it took (latency ) etc/...
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger: Logger = new Logger();
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req = ctx.switchToHttp().getRequest();
    const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - start;
        const method = req?.method;
        const url = req?.originalUrl;
        this.logger.log(
          JSON.stringify({
            level: 'info',
            msg: 'http_access',
            method,
            url,
            ms,
            reqId: req?.id,
          }),
        );
      }),
    );
  }
}
