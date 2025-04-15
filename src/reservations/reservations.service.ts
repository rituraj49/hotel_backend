import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation/reservation.entity';
import { Repository } from 'typeorm';
import { Room } from 'src/rooms/entities/room.entity/room.entity';
import { Guest } from 'src/guests/entities/guest.etity/guest.entity';
import { Payment } from 'src/payments/entities/payment.entity';

@Injectable()
export class ReservationsService {
    constructor(
        @InjectRepository(Reservation)
        private readonly reservationRepository: Repository<Reservation>,
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,
        @InjectRepository(Guest)
        private readonly guestRepository: Repository<Guest>,
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
    ) {
    }

    async createPayment(data: any) {
        const savedPayment = await this.paymentRepository.save(data);
            console.log('saved pau:', savedPayment)
        return savedPayment;
    }

    async createReservation(data: any, payment: Payment) {
        const room = await this.roomRepository.findOne({ where: { id: data.roomId }});
        const guest = await  this.guestRepository.findOne({ where: { id: data.guestId }});
        if(!room || !guest) {
            throw new NotFoundException('Room or Guest not found');
        }
        if(!room.isAvailable) {
            throw new BadRequestException('Room is not available');
        }

        const reservation = await this.reservationRepository.create({
            checkInDate: data.checkInDate,
            checkOutDate: data.checkOutDate,
            room,
            guest,
            payment,
            adults: Number(data.adults),
            children: Number(data.children),
            guestNames: data.guestNames,
        });
        // console.log('reservation created:', reservation)
        
        const savedReservation = await this.reservationRepository.save(reservation);
        console.log('saved resss:', savedReservation)
        if(savedReservation) {
            room.isAvailable = false;
            await this.roomRepository.save(room);
        }
        return savedReservation;
    }

    async getGuestReservations(guestId: number) {
        const guest = await this.guestRepository.findOne({ where: {id: guestId }});
        if(!guest) {
            throw new NotFoundException('No guest found');
        }

        const reservations = await this.reservationRepository.find({ 
            where: { guest: {id: guestId } },
            relations: ['room', 'guest', 'payment']
        });
        return reservations;
    }

    async updateReservation(data: any) {
        const reservation = await this.reservationRepository.findOne({ where: {id: data?.reservationId }});
        if(!reservation) throw new NotFoundException('no reservation found');
        
        reservation.checkInDate = data?.checkInDate;
        reservation.checkOutDate = data?.checkOutDate;
        reservation.adults = data?.adults;
        reservation.children = data?.children;
        reservation.guestNames = data?.guestNames;
        
        await this.reservationRepository.save(reservation);
        
        const updatedReservation = await this.reservationRepository.findOne({ where: {id: data?.reservationId }, relations:['room', 'guest', 'payment']});
        console.log('updated reservation:', updatedReservation)
        return updatedReservation;
    }
    
    async cancelReservation(id: number) {
        const reservation = await this.reservationRepository.findOne({ 
            where: { id }, 
            relations: ['room']
        });
        console.log('reservation:', reservation)
        if(!reservation) {
            throw new NotFoundException('no reservation foudnd');
        }
        const room = await this.roomRepository.findOne({where: {id: reservation.room.id}});
        if(!room) {
            throw new NotFoundException("room not found");
        }

        reservation.isCancelled = true;
        // console.log(reservation)
        await this.reservationRepository.save(reservation);
        
        room.isAvailable = true;
        await this.roomRepository.save(room);

        const cancelledReservation = await this.reservationRepository.findOne({ where: { id: reservation.id }, relations: ['room', 'payment']})
        return cancelledReservation;
    }
}
