import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity/room.entity';
import { Equal, ILike, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { RoomType } from 'src/enums/rommTypes';

@Injectable()
export class RoomsService implements OnModuleInit {
    constructor(
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,
    ) {}

    async onModuleInit() {
        const count = await this.roomRepository.count();
        if(count === 0) {
            await this.roomRepository.save([
                {
                    type: 'Single',
                    location: 'New York',
                    occupancy: 1,
                    price: 100,
                    isAvailable: true
                },
                {
                    type: 'Double',
                    location: 'New York',
                    occupancy: 2,
                    price: 200,
                    isAvailable: true
                },
                {
                    type: 'Suite',
                    location: 'New York',
                    occupancy: 4,
                    price: 300,
                    isAvailable: true
                },
                {
                    type: 'Double',
                    location: 'Los Angeles',
                    occupancy: 2,
                    price: 150,
                    isAvailable: true
                },
                {
                    type: 'Suite',
                    location: 'Chicago',
                    occupancy: 3,
                    price: 250,
                    isAvailable: true
                },
                {
                    type: 'Single',
                    location: 'San Francisco',
                    occupancy: 1,
                    price: 120,
                    isAvailable: true
                },
                {
                    type: 'Double',
                    location: 'Miami',
                    occupancy: 2,
                    price: 180,
                    isAvailable: true
                },
                {
                    type: 'Suite',
                    location: 'Seattle',
                    occupancy: 3,
                    price: 280,
                    isAvailable: true
                },
                {
                    type: 'Single',
                    location: 'Boston',
                    occupancy: 1,
                    price: 110,
                    isAvailable: true
                },
                {
                    type: 'Double',
                    location: 'Austin',
                    occupancy: 2,
                    price: 160,
                    isAvailable: true
                },
                {
                    type: 'Suite',
                    location: 'Denver',
                    occupancy: 3,
                    price: 260,
                    isAvailable: true
                },
                {
                    type: 'Single',
                    location: 'Atlanta',
                    occupancy: 1,
                    price: 95,
                    isAvailable: true
                },
                {
                    type: 'Single',
                    location: 'Atlanta',
                    occupancy: 1,
                    price: 95,
                    isAvailable: true
                },
                {
                    type: 'Double',
                    location: 'New York',
                    occupancy: 2,
                    price: 150,
                    isAvailable: true
                },
                {
                    type: 'Deluxe',
                    location: 'Chicago',
                    occupancy: 2,
                    price: 180,
                    isAvailable: true
                },
                {
                    type: 'Suite',
                    location: 'Los Angeles',
                    occupancy: 3,
                    price: 250,
                    isAvailable: false
                },
                {
                    type: 'Executive',
                    location: 'San Francisco',
                    occupancy: 2,
                    price: 220,
                    isAvailable: true
                },
                {
                    type: 'Single',
                    location: 'Miami',
                    occupancy: 1,
                    price: 110,
                    isAvailable: true
                },
                {
                    type: 'Double',
                    location: 'Seattle',
                    occupancy: 2,
                    price: 160,
                    isAvailable: true
                },
                {
                    type: 'Family',
                    location: 'Boston',
                    occupancy: 4,
                    price: 300,
                    isAvailable: false
                },
                {
                    type: 'Deluxe',
                    location: 'Houston',
                    occupancy: 2,
                    price: 190,
                    isAvailable: true
                },
                {
                    type: 'Suite',
                    location: 'Las Vegas',
                    occupancy: 3,
                    price: 240,
                    isAvailable: true
                }
            ])
        }
    }

    async findRooms(query: {
        type?: RoomType,
        location?: string,
        isAvailable?: boolean | undefined,
        occupancy?: number,
        minPrice?: number,
        maxPrice?: number,
        take?: number,
        page?: number,
        skip?: number,
        sort?: any
    }) {
        const whereClause: any = {};
        const order: any = {};
        // console.log('query service:', query)

        if(query.type) whereClause.type = ILike(`${query.type}`);
        if(query.isAvailable !== undefined) whereClause.isAvailable = query.isAvailable;
        if(query.location) whereClause.location = ILike(`%${query.location}%`);
        if(query.occupancy) whereClause.occupancy = Equal(query.occupancy);
        if(query.minPrice) whereClause.price = MoreThanOrEqual(query.minPrice);
        if(query.maxPrice) whereClause.price = LessThanOrEqual(query.maxPrice);

        if(query.sort) {
            const sort = query.sort.split(':');
            order[sort[0]] = sort[1];
        }
        const page = query.page ? query.page : 1;
        const take = query.take ? query.take : 10;
        const skip = query.skip ? query.skip : (page - 1) * take;
        // if(query.page && query.take) {
        //     // whereClause.skip = (query.page - 1) * query.limit;
        //     // query.skip = (query.page - 1) * query.take;
        // }
        const rooms = await this.roomRepository.findAndCount({
            where: whereClause,
            skip: skip,
            take: take,
            order: order
            // order: { price: 'ASC' }
        });

        return {
            data: rooms[0],
            paginationData: {
                page,
                limit: take,
                total: rooms[1],
                lastPage: Math.ceil(rooms[1] / take)
            }
        };
    }
}
