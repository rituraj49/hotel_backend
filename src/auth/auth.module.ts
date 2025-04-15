import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GuestsModule } from 'src/guests/guests.module';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtSecret } from 'src/common/constants';

@Module({
  imports: [
    GuestsModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '30d' }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
