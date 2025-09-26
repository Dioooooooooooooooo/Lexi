export declare class ErrorResponseDto {
    message: string;
    error: string;
}
export declare class SuccessResponseDto<T> {
    status?: string;
    message: string;
    data?: T;
}
