import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResponseService } from 'src/common/response.service';

@Controller('guests')
export class GuestsController {
    constructor(
        private readonly guestsService: GuestsService,
        private readonly responseService: ResponseService
    ) {}

    @Get('/profile')
    @UseGuards(JwtAuthGuard)
    async getGuestProfile(@Req() req) {
        try {
            const userDetails = await this.guestsService.getProfile(req.user.userId);
            return this.responseService.success('User details fetched successfully', userDetails);
        } catch (error) {
            return this.responseService.error(error.message, error);
        }
    }
}
