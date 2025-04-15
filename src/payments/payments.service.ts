import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
    ) {}

    async createPayment(data: any) {
        try {
            console.log('data in create payemnt:', data)
            // const payment = this.paymentRepository.create(data);
            return await this.paymentRepository.save(data);
            // console.log('sv pay:', savedPayment)
            // return savedPayment;
        } catch (error) {
            console.error('error while  creating payment', error)
            throw error;
        }
    }
}
