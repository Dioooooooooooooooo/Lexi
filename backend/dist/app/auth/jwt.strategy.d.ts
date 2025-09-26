import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    validate(payload: any): Promise<{
        created_at: Date;
        id: string;
        updated_at: Date;
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        avatar: string;
        is_email_verified: boolean;
        is_phone_verified: boolean;
        phone: string;
        role: string;
    }>;
}
export {};
