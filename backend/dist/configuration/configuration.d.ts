declare const _default: () => {
    port: number;
    database: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
        ssl: {
            rejectUnauthorized: boolean;
        };
    };
};
export default _default;
