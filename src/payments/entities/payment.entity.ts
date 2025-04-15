import { Reservation } from "src/reservations/entities/reservation/reservation.entity";
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column("decimal", { precision: 10, scale: 2 })
    amount: number;

    @Column()
    transactionNumber: string;

    @Column()
    paymentDate: Date;

    @Column()
    paymentMethod: string;

    @Column()
    paymentStatus: string;

    @OneToOne(() => Reservation, (reservation) => reservation.payment)
    reservation: Reservation;

    @CreateDateColumn()
        createdAt: Date;
    
    @UpdateDateColumn()
    updatedAt: Date;
}
