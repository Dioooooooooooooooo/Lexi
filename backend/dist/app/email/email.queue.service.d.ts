export declare class EmailQueueService {
    private readonly logger;
    private queueFile;
    private processing;
    enqueue(mailOptions: any): Promise<void>;
    private readQueue;
    private writeQueue;
    processQueue(): Promise<void>;
}
