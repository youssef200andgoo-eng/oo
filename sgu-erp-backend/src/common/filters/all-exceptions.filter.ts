import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  requestId: string;
  stack?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    const rawRequestId = request.headers['x-request-id'];
    const requestId = (Array.isArray(rawRequestId) ? rawRequestId[0] : rawRequestId) || `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const message = exception instanceof Error ? exception.message : 'Internal server error';

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: status,
      message: message,
      error: exception.name || 'Error',
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId,
    };

    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = exception.stack;
    }

    this.logger.error(
      `[${requestId}] ${request.method} ${request.url} - Unhandled Error: ${message}`,
      exception.stack,
    );

    response.status(status).json(errorResponse);
  }
}
