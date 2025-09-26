export declare class ImagekitService {
    private imageKit;
    constructor();
    uploadImage(file: Express.Multer.File): Promise<string>;
}
