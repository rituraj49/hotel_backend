import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation/reservation.entity';
import { RoomsModule } from 'src/rooms/rooms.module';
import { GuestsModule } from 'src/guests/guests.module';
import { Guest } from 'src/guests/entities/guest.etity/guest.entity';
import { Room } from 'src/rooms/entities/room.entity/room.entity';
import { FakePaymentService } from './fake-payment.service';
import { Payment } from 'src/payments/entities/payment.entity';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Reservation, Guest, Room, Payment]),
    RoomsModule,
    GuestsModule,
    PaymentsModule
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, FakePaymentService],
  exports: [ReservationsService]
})
export class ReservationsModule {}
