import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  requestId: string;
  details?: any;
  stack?: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const rawRequestId = request.headers['x-request-id'];
    const requestId = (Array.isArray(rawRequestId) ? rawRequestId[0] : rawRequestId) || this.generateRequestId();

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: status,
      message: this.extractMessage(exceptionResponse),
      error: exception.name,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId,
      details: typeof exceptionResponse === 'object' ? (exceptionResponse as any).details : undefined,
    };

    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = exception.stack;
    }

    this.logger.error(
      `[${requestId}] ${request.method} ${request.url} - ${status}: ${errorResponse.message}`,
      exception.stack,
    );

    response.status(status).json(errorResponse);
  }

  private extractMessage(response: string | object): string {
    if (typeof response === 'string') {
      return response;
    }
    const message = (response as any).message;
    if (Array.isArray(message)) {
      return message.join(', ');
    }
    return message || 'An error occurred';
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}
