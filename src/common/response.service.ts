import { Injectable } from "@nestjs/common";

enum statusText {
    success = 'success',
    error = 'error',
}

export interface ApiResponse<T> {
    status: statusText;
    message: string;
    data?: T;
}

@Injectable()
export class ResponseService {
    success<T>(message: string, data?: T): ApiResponse<T> {
        return {
            status: statusText.success,
            message,
            data,
        };
    }

    error(message: string, data?: any): ApiResponse<any> {
        return {
            status: statusText.error,
            message,
            data
        }
    }
}