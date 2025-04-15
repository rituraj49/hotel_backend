import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GuestsModule } from 'src/guests/guests.module';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    GuestsModule,
    JwtModule.register({
      secret: '3949erofjw9348eorjvo9wrei',
      signOptions: { expiresIn: '30d' }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
