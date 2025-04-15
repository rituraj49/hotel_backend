import { Guest } from "src/guests/entities/guest.etity/guest.entity";
import { Payment } from "src/payments/entities/payment.entity";
import { Room } from "src/rooms/entities/room.entity/room.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    checkInDate: Date;

    @Column()
    checkOutDate: Date;

    @Column()
    adults: number;

    @Column()
    children: number;

    @Column("simple-array")
    guestNames: string[];

    @ManyToOne(guest => Guest, (guest) => guest.reservations)
    guest: Guest;

    @ManyToOne(() => Room)
    room: Room;

    @Column({ default: false })
    isCancelled: boolean;

    @OneToOne(() => Payment, (payment) => payment.reservation)
    @JoinColumn()
    payment: Payment;
}
