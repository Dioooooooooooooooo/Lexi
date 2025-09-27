import { AsyncLocalStorage } from "async_hooks";
import { Request, Response } from "express";
export interface RequestContextStore {
    req: Request;
    res: Response;
}
export declare const requestContext: AsyncLocalStorage<RequestContextStore>;
export declare function getCurrentRequest(): Request;
export declare function getCurrentResponse(): Response;
