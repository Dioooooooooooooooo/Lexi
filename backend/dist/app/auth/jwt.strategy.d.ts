import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    validate(payload: any): Promise<{
        id: string;
        avatar: string;
        created_at: Date;
        email: string;
        first_name: string;
        is_email_verified: boolean;
        is_phone_verified: boolean;
        last_name: string;
        phone: string;
        updated_at: Date;
        username: string;
        role: string;
    }>;
}
export {};
