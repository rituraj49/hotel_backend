import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest } from './entities/guest.etity/guest.entity';

@Injectable()
export class GuestsService implements OnModuleInit{
    constructor(
        @InjectRepository(Guest)
        private readonly guestRepository: Repository<Guest>
    ) {}

    async onModuleInit() {
        const count = await this.guestRepository.count();
        if(count === 0) {
            await this.guestRepository.save([
                {
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    password: '12345678',
                    reservations: []
                },
                {
                    name: 'Jane Doe',
                    email: 'jane.doe@test.com',
                    password: '12345678',
                    reservations: []
                },
            ])
        }
    }

    async createGuest(data: any) {
        return await this.guestRepository.save(data);
    }

    async getProfile(guestId: number) {
        const result = await this.guestRepository.findOne({
            where: { id: guestId},
            relations: ['reservations', 'reservations.room', 'reservations.payment']
        });
        if(!result) throw new NotFoundException('result not found');

        const {password, ...user} = result;
        console.log('user:', user)
        return user;
    }

    async findByEmail(email: string) {
        const guest = await this.guestRepository.findOne({
            where: { email }
        });
        if(!guest) throw new NotFoundException('user not found');

        return guest;
    }

    async findExistingUser(email: string) {
        const guest = await this.guestRepository.findOne({
            where: { email }
        });
        if(guest) {
            return { exists: true };
        }
        return { exists: false };
    }
}
