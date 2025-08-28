import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./jwt.strategy";
import { EmailModule } from "../email/email.module";
import { UserService } from "../user/user.service";
import { PupilsService } from "../pupils/pupils.service";

@Module({
  imports: [
    PassportModule,
    EmailModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET") || "your-secret-key",
        signOptions: { expiresIn: "1h" },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserService, PupilsService],
  exports: [AuthService, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule { }
