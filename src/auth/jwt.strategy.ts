import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { GuestsService } from "src/guests/guests.service";
import { ConfigService } from '@nestjs/config';
import { jwtSecret } from "src/common/constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private guestsService: GuestsService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtSecret,
            ignoreExpiration: false
        })
    }

    async validate(payload: any) {
        const user = await this.guestsService.findByEmail(payload.email);
        if(!user) {
            throw new UnauthorizedException('Invalid token');
        }
        return {
            userId: payload.sub,
            data: user
        };
    }    
}