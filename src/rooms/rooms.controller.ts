import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Controller({
    path: 'rooms',
    version: '1.0'
})
export class RoomsController {
    constructor(
        private readonly roomsService: RoomsService,
    ) {}
    @Get()
    async findRooms(@Query() query) {
        try {
            // console.log('query:', query)
            // console.log('query:', Boolean(query))
            const available = query.isAvailable && (query.isAvailable == 'false' ? false : true);
            
            const { 
                type, 
                location, 
                occupancy, 
                minPrice,
                maxPrice,
                page, 
                limit, 
                skip, 
                sort,
            } = query;
            // const skip = (page - 1) * limit;
            const data = await this.roomsService.findRooms({
                type,
                location,
                isAvailable: available, 
                occupancy: occupancy ? Number(occupancy) : undefined,
                minPrice,
                maxPrice,
                take: parseInt(limit),
                page: page,
                skip: skip,
                sort
            });
            return {
                data: data.data,
                paginationData: data.paginationData,
            }
        } catch (error) {
            throw new HttpException(error.message, 500);
        }
    }
}
