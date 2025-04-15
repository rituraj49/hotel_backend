import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation/reservation.entity';
import { Repository } from 'typeorm';
import { Room } from 'src/rooms/entities/room.entity/room.entity';
import { Guest } from 'src/guests/entities/guest.etity/guest.entity';

@Injectable()
export class FakePaymentService {
    constructor(
      
    ) {}

    async fakePayment() {
        return true;
    }
}
