import { Pupil, Teacher } from "@/database/schemas";
export interface AccessTokenPayload {
    sub: string;
    email: string;
    role: string;
    pupil?: Pupil;
    teacher?: Teacher;
}
export interface JwtAccessTokenPayload extends AccessTokenPayload {
    iat: number;
    exp: number;
}
