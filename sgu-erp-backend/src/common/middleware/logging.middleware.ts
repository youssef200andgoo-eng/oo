import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      const requestId = req.headers['x-request-id'] || '';

      this.logger.log(
        `[${requestId}] ${method} ${originalUrl} ${statusCode} - ${duration}ms - IP: ${ip} - UA: ${userAgent}`
      );
    });

    next();
  }
}
