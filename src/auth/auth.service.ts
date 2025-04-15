import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GuestsService } from 'src/guests/guests.service';
import * as bcrypt from "bcrypt";   

@Injectable()
export class AuthService {
    constructor(
        private guestService: GuestsService,
        private jwtService: JwtService
    ) {}

    async validateUser (email: string, password: string) {
        const user = await this.guestService.findByEmail(email);
        if(user && bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async loginUser(user: any) {
        const payload = { email: user.email, sub: user.id }
        const access_token = this.jwtService.sign(payload);
        return { access_token };
    }

    async registerUser(data: any) {
        const existingUser = await this.guestService.findExistingUser(data.email);

        if(existingUser.exists) {
            throw new ConflictException('User with this email already exists')
        }

        const hashedPass = await bcrypt.hash(data.password, 10);
        console.log({hashedPass})
        const user = await this.guestService.createGuest({
            ...data,
            password: hashedPass
        });
        const { access_token } = await this.loginUser(user);
        return {
            access_token,
            user: user
        };
    }
}
