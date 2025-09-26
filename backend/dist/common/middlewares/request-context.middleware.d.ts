import { NestMiddleware } from "@nestjs/common";
export declare class RequestContextMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void): void;
}
