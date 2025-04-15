import { BadRequestException, Body, Controller, Get, InternalServerErrorException, NotFoundException, Param, Post, PreconditionFailedException, Put, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/createReservationDto';
import { ApiResponse, ResponseService } from 'src/common/response.service';
import { FakePaymentService } from './fake-payment.service';
import { PaymentsService } from 'src/payments/payments.service';
import { UpdateReservationDto } from './dto/updateReservationDto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller({
    path: 'reservations',
    version: '1'
})
export class ReservationsController{
    constructor(
        private readonly reservationsService: ReservationsService,
        private readonly apiResponse: ResponseService,
        private readonly paymentsService: PaymentsService
    ) {}

    @Get('/:guestId')
    @UseGuards(JwtAuthGuard)
    async getReservationsForGuest(@Param('guestId') guestId: number) {
        try {
            const reservations = await this.reservationsService.getGuestReservations(guestId);
            if(reservations.length === 0) {
                return [];
            }
            return this.apiResponse.success('Reservations found', reservations);
        } catch (error) {
            if(error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    @Post('/create')
    @UseGuards(JwtAuthGuard)
    async createReservation(@Body() createReservationDto: CreateReservationDto) {
        try {
            // const paymentSuccess = await this.fakePaymentService.fakePayment();
            // if(!paymentSuccess) {
            //     throw new InternalServerErrorException('payment failed');
            // }
            const paymentData = {
                amount: createReservationDto.amount,
                transactionNumber: '1234567890',
                paymentDate: new Date(),
                paymentMethod: 'Credit Card',
                paymentStatus: 'success',
                // reservation: createReservationDto.reservationId
            }
            const payment = await this.paymentsService.createPayment(paymentData);
            // const payment = await this.reservationsService.createPayment(paymentData);
            console.log('payment created:', payment.paymentStatus)
            // if(payment && payment.paymentStatus != 'success') {
            //     throw new BadRequestException('Payment failed');
            // }
            if(payment?.paymentStatus !== 'success') {
                throw new BadRequestException('Payment failed');
            }
            const newReservation = await this.reservationsService.createReservation(createReservationDto, payment);
            
            console.log('create dto:', createReservationDto)
            return this.apiResponse.success('reservation created successfully', newReservation);
        } catch (error) {
            console.error('error :', error)
            if(error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    @Put('/update')
    @UseGuards(JwtAuthGuard)
    async updateReservation(@Body() updateReservationDto: UpdateReservationDto) {
        try {
            const reservation = await this.reservationsService.updateReservation(updateReservationDto);
            return this.apiResponse.success('reservation updated successfully', reservation);
        } catch (error) {
            if(error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }
    @Put('/cancel/:id')
    @UseGuards(JwtAuthGuard)
    async cancelReservation(@Param('id') id: number) {
        try {
            const reservation = await this.reservationsService.cancelReservation(id);
            return this.apiResponse.success('reservation cancelled successfully', reservation);
        } catch (error) {
            if(error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

}