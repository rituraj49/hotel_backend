import { Module } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { GuestsController } from './guests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from './entities/guest.etity/guest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guest])],
  providers: [GuestsService],
  controllers: [GuestsController],
  exports: [GuestsService]
})
export class GuestsModule {}
