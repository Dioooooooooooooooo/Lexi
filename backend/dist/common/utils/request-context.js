"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestContext = void 0;
exports.getCurrentRequest = getCurrentRequest;
exports.getCurrentResponse = getCurrentResponse;
const async_hooks_1 = require("async_hooks");
exports.requestContext = new async_hooks_1.AsyncLocalStorage();
function getCurrentRequest() {
    const store = exports.requestContext.getStore();
    if (!store)
        throw new Error("No request context found");
    return store.req;
}
function getCurrentResponse() {
    const store = exports.requestContext.getStore();
    if (!store)
        throw new Error("No request context found");
    return store.res;
}
//# sourceMappingURL=request-context.js.map